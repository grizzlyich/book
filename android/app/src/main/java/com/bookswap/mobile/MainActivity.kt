package com.bookswap.mobile

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.material3.MaterialTheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import com.bookswap.mobile.data.LoginRequest
import com.bookswap.mobile.network.ApiClient
import com.bookswap.mobile.network.AuthStore
import com.bookswap.mobile.ui.AppState
import com.bookswap.mobile.ui.screens.HomeScreen
import com.bookswap.mobile.ui.screens.LoginScreen
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            MaterialTheme { BookSwapApp() }
        }
    }
}

@Composable
private fun BookSwapApp() {
    val scope = rememberCoroutineScope()
    val state = remember { AppState() }

    fun refreshData() {
        scope.launch {
            state.statusText = "Загружаем профиль и книги..."
            val result = runCatching {
                withContext(Dispatchers.IO) {
                    val me = ApiClient.api.me()
                    val booksPage = ApiClient.api.books()
                    me to booksPage.results
                }
            }
            result.onSuccess {
                state.profile = it.first
                state.books = it.second
                state.statusText = "Данные обновлены"
            }.onFailure {
                state.statusText = "Ошибка: ${it.message}"
            }
        }
    }

    if (!state.isLoggedIn) {
        LoginScreen(onLogin = { username, password ->
            scope.launch {
                state.statusText = "Выполняем вход..."
                val result = runCatching {
                    withContext(Dispatchers.IO) {
                        ApiClient.api.login(LoginRequest(username, password))
                    }
                }
                result.onSuccess {
                    AuthStore.accessToken = it.access
                    AuthStore.refreshToken = it.refresh
                    state.isLoggedIn = true
                    refreshData()
                }.onFailure {
                    state.statusText = "Ошибка входа: ${it.message}"
                }
            }
        }, status = state.statusText)
    } else {
        HomeScreen(
            profile = state.profile,
            books = state.books,
            status = state.statusText,
            onRefresh = { refreshData() },
            onLogout = {
                AuthStore.clear()
                state.isLoggedIn = false
                state.profile = null
                state.books = emptyList()
                state.statusText = "Вы вышли"
            }
        )
    }
}

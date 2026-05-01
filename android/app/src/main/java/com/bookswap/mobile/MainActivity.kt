package com.bookswap.mobile

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Book
import androidx.compose.material.icons.filled.Chat
import androidx.compose.material.icons.filled.Help
import androidx.compose.material.icons.filled.LocationOn
import androidx.compose.material.icons.filled.Map
import androidx.compose.material.icons.filled.Person
import androidx.compose.material3.AssistChip
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.unit.dp
import com.bookswap.mobile.data.BookItem
import com.bookswap.mobile.data.LoginRequest
import com.bookswap.mobile.network.ApiClient
import com.bookswap.mobile.network.AuthStore
import com.bookswap.mobile.ui.AppState
import com.bookswap.mobile.ui.screens.LoginScreen
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent { MaterialTheme { BookSwapApp() } }
    }
}

enum class TabItem(val label: String, val icon: ImageVector) {
    HOME("Главная", Icons.Default.Book),
    BOOKS("Каталог", Icons.Default.Book),
    MAP("Карта", Icons.Default.Map),
    FAQ("FAQ", Icons.Default.Help),
    EXCHANGES("Обмены", Icons.Default.Chat),
    REVIEWS("Отзывы", Icons.Default.Chat),
    PROFILE("Профиль", Icons.Default.Person)
}

@Composable
private fun BookSwapApp() {
    val scope = rememberCoroutineScope()
    val state = remember { AppState() }
    var selectedTab by remember { mutableStateOf(TabItem.HOME) }

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
        return
    }

    Scaffold(
        topBar = {
            Row(
                modifier = Modifier.fillMaxWidth().padding(16.dp),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                listOf(TabItem.HOME, TabItem.BOOKS, TabItem.MAP, TabItem.FAQ).forEach { tab ->
                    AssistChip(
                        onClick = { selectedTab = tab },
                        label = { Text(tab.label) },
                        leadingIcon = { Icon(tab.icon, contentDescription = tab.label) }
                    )
                }
            }
        },
        bottomBar = {
            NavigationBar {
                listOf(TabItem.EXCHANGES, TabItem.REVIEWS, TabItem.PROFILE).forEach { tab ->
                    NavigationBarItem(
                        selected = selectedTab == tab,
                        onClick = { selectedTab = tab },
                        icon = { Icon(tab.icon, contentDescription = tab.label) },
                        label = { Text(tab.label) }
                    )
                }
            }
        }
    ) { padding ->
        HomeStyledScreen(
            modifier = Modifier.padding(padding),
            profileName = state.profile?.username ?: "пользователь",
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

@Composable
private fun HomeStyledScreen(
    modifier: Modifier = Modifier,
    profileName: String,
    books: List<BookItem>,
    status: String,
    onRefresh: () -> Unit,
    onLogout: () -> Unit
) {
    LazyColumn(
        modifier = modifier.fillMaxSize().padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        item {
            Card(colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.primaryContainer)) {
                Column(Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    Text("Привет, $profileName", style = MaterialTheme.typography.headlineSmall)
                    Text("Статус: $status")
                    Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        AssistChip(onClick = onRefresh, label = { Text("Обновить") }, leadingIcon = { Icon(Icons.Default.Book, null) })
                        AssistChip(onClick = onLogout, label = { Text("Выйти") }, leadingIcon = { Icon(Icons.Default.Person, null) })
                    }
                }
            }
        }

        item { SectionCard("Каталог книг", "Ищи книги по названию, жанру и городу.", Icons.Default.Book) }
        item { SectionCard("Обмены", "Отправляй заявки и следи за их статусом.", Icons.Default.Chat) }
        item { SectionCard("Карта", "Смотри книги рядом на карте.", Icons.Default.LocationOn) }
        item { SectionCard("FAQ", "Кратко о том, как работает сервис.", Icons.Default.Help) }

        items(books) { book ->
            Card {
                Column(Modifier.padding(14.dp)) {
                    Text(book.title, style = MaterialTheme.typography.titleMedium)
                    Text("${book.author} • ${book.city ?: "—"}")
                }
            }
        }
    }
}

@Composable
private fun SectionCard(title: String, subtitle: String, icon: ImageVector) {
    Card {
        Row(
            modifier = Modifier.fillMaxWidth().padding(16.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            Icon(icon, contentDescription = title)
            Column {
                Text(title, style = MaterialTheme.typography.titleMedium)
                Text(subtitle)
            }
        }
    }
}

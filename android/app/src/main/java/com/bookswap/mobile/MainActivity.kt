package com.bookswap.mobile

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.Button
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import com.bookswap.mobile.network.ApiClient
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            MaterialTheme {
                HealthScreen()
            }
        }
    }
}

@Composable
private fun HealthScreen() {
    val scope = rememberCoroutineScope()
    var state by remember { mutableStateOf("Нажми кнопку, чтобы проверить backend") }

    Column(
        modifier = Modifier.fillMaxSize(),
        verticalArrangement = Arrangement.Center,
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text(text = state)
        Button(onClick = {
            scope.launch {
                state = "Проверяем API..."
                val result = runCatching {
                    withContext(Dispatchers.IO) {
                        ApiClient.api.health().status
                    }
                }
                state = result.fold(
                    onSuccess = { "Backend status: $it" },
                    onFailure = { "Ошибка: ${it.message}" }
                )
            }
        }) {
            Text("Проверить API")
        }
    }
}

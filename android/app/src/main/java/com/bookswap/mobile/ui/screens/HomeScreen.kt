package com.bookswap.mobile.ui.screens

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.Button
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.bookswap.mobile.data.BookItem
import com.bookswap.mobile.data.UserProfile

@Composable
fun HomeScreen(
    profile: UserProfile?,
    books: List<BookItem>,
    status: String,
    onRefresh: () -> Unit,
    onLogout: () -> Unit
) {
    Column(modifier = Modifier.fillMaxSize().padding(16.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
        Text("Привет, ${profile?.username ?: "пользователь"}")
        Text("Статус: $status")
        Button(onClick = onRefresh) { Text("Обновить данные") }
        Button(onClick = onLogout) { Text("Выйти") }

        LazyColumn(verticalArrangement = Arrangement.spacedBy(8.dp)) {
            items(books) { book ->
                Text("${book.title} — ${book.author} (${book.city ?: "—"})")
            }
        }
    }
}

package com.bookswap.mobile.ui

import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import com.bookswap.mobile.data.BookItem
import com.bookswap.mobile.data.UserProfile

class AppState {
    var isLoggedIn by mutableStateOf(false)
    var statusText by mutableStateOf("Готово")
    var profile by mutableStateOf<UserProfile?>(null)
    var books by mutableStateOf<List<BookItem>>(emptyList())
}

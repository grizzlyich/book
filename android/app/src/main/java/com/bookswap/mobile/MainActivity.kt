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
import androidx.compose.runtime.mutableStateListOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.unit.dp
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.bookswap.mobile.data.BookItem
import com.bookswap.mobile.data.ExchangeItem
import com.bookswap.mobile.data.LoginRequest
import com.bookswap.mobile.data.ReviewItem
import com.bookswap.mobile.network.ApiClient
import com.bookswap.mobile.network.AuthStore
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

data class NavItem(val route: String, val label: String, val icon: ImageVector)

@Composable
private fun BookSwapApp() {
    val scope = rememberCoroutineScope()
    val navController = rememberNavController()
    var isLoggedIn by remember { mutableStateOf(false) }
    var username by remember { mutableStateOf("пользователь") }
    var status by remember { mutableStateOf("Готово") }

    val books = remember { mutableStateListOf<BookItem>() }
    val myBooks = remember { mutableStateListOf<BookItem>() }
    val exchanges = remember { mutableStateListOf<ExchangeItem>() }
    val reviews = remember { mutableStateListOf<ReviewItem>() }

    suspend fun reloadAll() {
        val me = ApiClient.api.me()
        username = me.username
        books.clear(); books.addAll(ApiClient.api.books().results)
        myBooks.clear(); myBooks.addAll(ApiClient.api.myBooks().results)
        exchanges.clear(); exchanges.addAll(ApiClient.api.exchanges().results)
        reviews.clear(); reviews.addAll(ApiClient.api.reviews().results)
    }

    if (!isLoggedIn) {
        LoginScreen(onLogin = { login, password ->
            scope.launch {
                status = "Выполняем вход..."
                runCatching {
                    withContext(Dispatchers.IO) { ApiClient.api.login(LoginRequest(login, password)) }
                }.onSuccess {
                    AuthStore.accessToken = it.access
                    AuthStore.refreshToken = it.refresh
                    isLoggedIn = true
                    status = "Загружаем данные..."
                    runCatching { withContext(Dispatchers.IO) { reloadAll() } }
                        .onSuccess { status = "Данные обновлены" }
                        .onFailure { status = "Ошибка загрузки: ${it.message}" }
                }.onFailure { status = "Ошибка входа: ${it.message}" }
            }
        }, status = status)
        return
    }

    val topItems = listOf(
        NavItem("home", "Главная", Icons.Default.Book),
        NavItem("books", "Каталог", Icons.Default.Book),
        NavItem("map", "Карта", Icons.Default.Map),
        NavItem("faq", "FAQ", Icons.Default.Help),
        NavItem("my_books", "Мои книги", Icons.Default.Book)
    )
    val bottomItems = listOf(
        NavItem("exchanges", "Обмены", Icons.Default.Chat),
        NavItem("reviews", "Отзывы", Icons.Default.Chat),
        NavItem("profile", "Профиль", Icons.Default.Person)
    )

    Scaffold(
        topBar = { TopNav(topItems, navController) },
        bottomBar = { BottomNav(bottomItems, navController) }
    ) { padding ->
        NavHost(
            navController = navController,
            startDestination = "home",
            modifier = Modifier.padding(padding)
        ) {
            composable("home") {
                HomeScreen(username, status, onRefresh = {
                    scope.launch {
                        status = "Обновляем..."
                        runCatching { withContext(Dispatchers.IO) { reloadAll() } }
                            .onSuccess { status = "Данные обновлены" }
                            .onFailure { status = "Ошибка: ${it.message}" }
                    }
                }, onLogout = {
                    AuthStore.clear(); isLoggedIn = false; status = "Вы вышли"
                })
            }
            composable("books") { BookListScreen("Каталог", books) }
            composable("my_books") { BookListScreen("Мои книги", myBooks) }
            composable("map") { InfoScreen("Карта", "Карта доступна в web, мобильный экран подготовлен.", Icons.Default.LocationOn) }
            composable("faq") { InfoScreen("FAQ", "Добавь экран FAQ по аналогии с web-версией.", Icons.Default.Help) }
            composable("exchanges") { ExchangeScreen(exchanges) }
            composable("reviews") { ReviewScreen(reviews) }
            composable("profile") { InfoScreen("Профиль", "Пользователь: $username", Icons.Default.Person) }
        }
    }
}

@Composable private fun TopNav(items: List<NavItem>, nav: NavHostController) {
    Row(Modifier.fillMaxWidth().padding(8.dp), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
        items.forEach { item ->
            AssistChip(onClick = { nav.navigate(item.route) }, label = { Text(item.label) }, leadingIcon = { Icon(item.icon, null) })
        }
    }
}

@Composable private fun BottomNav(items: List<NavItem>, nav: NavHostController) {
    NavigationBar { items.forEach { item -> NavigationBarItem(selected = false, onClick = { nav.navigate(item.route) }, icon = { Icon(item.icon, null) }, label = { Text(item.label) }) } }
}

@Composable private fun HomeScreen(name: String, status: String, onRefresh: () -> Unit, onLogout: () -> Unit) {
    Column(Modifier.fillMaxSize().padding(16.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
        Card(colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.primaryContainer)) {
            Column(Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                Text("Привет, $name", style = MaterialTheme.typography.headlineSmall)
                Text("Статус: $status")
                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    AssistChip(onClick = onRefresh, label = { Text("Обновить") }, leadingIcon = { Icon(Icons.Default.Book, null) })
                    AssistChip(onClick = onLogout, label = { Text("Выйти") }, leadingIcon = { Icon(Icons.Default.Person, null) })
                }
            }
        }
        SectionCard("Каталог книг", "Ищи книги по названию, жанру и городу.", Icons.Default.Book)
        SectionCard("Обмены", "Отправляй заявки и следи за статусами.", Icons.Default.Chat)
        SectionCard("Карта", "Смотри книги рядом на карте.", Icons.Default.LocationOn)
    }
}

@Composable private fun BookListScreen(title: String, books: List<BookItem>) {
    LazyColumn(Modifier.fillMaxSize().padding(16.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
        item { Text(title, style = MaterialTheme.typography.headlineSmall) }
        items(books) { book -> SectionCard(book.title, "${book.author} • ${book.city ?: "—"}", Icons.Default.Book) }
    }
}

@Composable private fun ExchangeScreen(items: List<ExchangeItem>) {
    LazyColumn(Modifier.fillMaxSize().padding(16.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
        item { Text("Обмены", style = MaterialTheme.typography.headlineSmall) }
        items(items) { ex -> SectionCard("Заявка #${ex.id}", "${ex.status} • ${ex.message ?: "без сообщения"}", Icons.Default.Chat) }
    }
}

@Composable private fun ReviewScreen(items: List<ReviewItem>) {
    LazyColumn(Modifier.fillMaxSize().padding(16.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
        item { Text("Отзывы", style = MaterialTheme.typography.headlineSmall) }
        items(items) { rev -> SectionCard("Оценка: ${rev.rating}", rev.comment ?: "без комментария", Icons.Default.Chat) }
    }
}

@Composable private fun InfoScreen(title: String, text: String, icon: ImageVector) {
    Column(Modifier.fillMaxSize().padding(16.dp)) { SectionCard(title, text, icon) }
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

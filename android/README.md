# BookSwap Android (native)

Стартовый нативный Android-клиент (Kotlin + Jetpack Compose) для текущего backend API.

## Что уже сделано
- Базовый Android-проект с Compose.
- Сетевой слой на Retrofit/OkHttp.
- Экран проверки backend через `GET /api/health/`.

## Как запустить
1. Установи Android Studio (Hedgehog+).
2. Открой папку `android/` как отдельный проект.
3. URL backend уже предзадан: `https://book-4awi.onrender.com/api/`.
4. Запусти на эмуляторе/устройстве.

> Если backend URL изменится, обнови `API_BASE_URL` в `app/build.gradle.kts`.

## Следующие шаги
- Добавить экраны auth (`/api/auth/login`, `/api/auth/register`).
- Добавить список книг (`/api/books/`) и детали книги.
- Подключить JWT (access/refresh) и хранение токенов (DataStore).


## Реализовано в MVP
- Логин через `POST /api/auth/login/`.
- Получение профиля `GET /api/auth/me/`.
- Получение списка книг `GET /api/books/`.
- Простейший in-memory logout (токены пока не персистятся).

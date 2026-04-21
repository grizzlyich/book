# Frontend (Vercel)

## Локальный запуск
```bash
npm install
cp .env.example .env
npm run dev
```

## Обязательные переменные окружения
- `VITE_API_BASE_URL=https://<твой-backend>.onrender.com/api`
- `VITE_YANDEX_MAPS_API_KEY=<ключ Яндекс Карт>`

## Карта
Проект использует **Yandex Maps JS API v3**. Для работы карты нужен ключ c ограничением по HTTP Referer для твоего домена Vercel.

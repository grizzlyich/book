# Deploy checklist: Render + Vercel

## Render (backend)
Добавить в **Render → book → Environment**:

- `DATABASE_URL` = строка подключения Postgres
- `DEBUG=False`
- `SECRET_KEY=<your-secret>`
- `ALLOWED_HOSTS=127.0.0.1,localhost,book-4awi.onrender.com`
- `CORS_ALLOWED_ORIGINS=http://127.0.0.1:5173,http://localhost:5173,https://book-six-delta.vercel.app`
- `CSRF_TRUSTED_ORIGINS=http://127.0.0.1:5173,http://localhost:5173,https://book-six-delta.vercel.app`

Build command:
```bash
pip install -r requirements.txt && python manage.py collectstatic --noinput && python manage.py migrate
```

Start command:
```bash
gunicorn config.wsgi:application
```

## Vercel (frontend)
Root Directory: `frontend`

Environment Variables:
- `VITE_API_BASE_URL=https://book-4awi.onrender.com/api`

## Что именно защищено в проекте
- авторизация на создание/изменение объектов
- owner-check на изменение книг
- throttling на регистрацию, логин и загрузки
- валидация изображений по расширению, MIME и содержимому
- ограничение размера файлов
- UUID имена загруженных файлов
- очистка пользовательского текста от HTML

# Deploy: Render + Vercel

## 1) Backend на Render

### Root Directory
`backend`

### Build Command
```bash
./build.sh
```

### Start Command
```bash
gunicorn config.wsgi:application
```

### Environment Variables
```env
DEBUG=False
SECRET_KEY=<your-secret-key>
DATABASE_URL=<your-postgres-connection-string>
ALLOWED_HOSTS=book-4awi.onrender.com
CORS_ALLOWED_ORIGINS=https://book-six-delta.vercel.app
CSRF_TRUSTED_ORIGINS=https://book-six-delta.vercel.app
```

После сохранения сделай redeploy.

## 2) Frontend на Vercel

### Root Directory
`frontend`

### Environment Variables
```env
VITE_API_BASE_URL=https://book-4awi.onrender.com/api
```

### После деплоя
Если адрес Vercel изменится, обнови на Render:
```env
CORS_ALLOWED_ORIGINS=https://<your-vercel-app>.vercel.app
CSRF_TRUSTED_ORIGINS=https://<your-vercel-app>.vercel.app
```

## 3) Проверка

Backend:
- `https://book-4awi.onrender.com/`
- `https://book-4awi.onrender.com/api/docs/`
- `https://book-4awi.onrender.com/api/health/`

Frontend:
- открой ссылку Vercel
- проверь регистрацию и логин
- проверь каталог книг и защищённые страницы

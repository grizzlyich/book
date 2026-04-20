# DEPLOY.md

## Вариант, который реально работает
- **Frontend:** Vercel
- **Backend:** Render
- **Database:** Render Postgres или внешний PostgreSQL

---

## 1. Подготовить GitHub

```bash
git init
git add .
git commit -m "Prepare BookCross for Vercel + Render"
git branch -M main
git remote add origin https://github.com/<username>/<repo>.git
git push -u origin main
```

---

## 2. Backend на Render

1. Создай новый Web Service на Render.
2. Подключи GitHub-репозиторий.
3. `Root Directory` = `backend`
4. `Build Command` = `./build.sh`
5. `Start Command` = `gunicorn config.wsgi:application`
6. Добавь PostgreSQL (или используй внешний `DATABASE_URL`).

### Переменные окружения backend

- `DEBUG=False`
- `SECRET_KEY=<случайная строка>`
- `DATABASE_URL=<postgres connection string>`
- `ALLOWED_HOSTS=<твой render домен>`
- `CORS_ALLOWED_ORIGINS=https://<твой-frontend>.vercel.app`
- `CSRF_TRUSTED_ORIGINS=https://<твой-frontend>.vercel.app`

После первого деплоя Render даст URL вида:
`https://bookcross-api.onrender.com`

Проверь:
- `https://bookcross-api.onrender.com/api/health/`
- `https://bookcross-api.onrender.com/api/docs/`

---

## 3. Frontend на Vercel

1. Создай проект в Vercel из этого GitHub-репозитория.
2. `Root Directory` = `frontend`
3. Framework Preset Vercel обычно определит сам как **Vite**.
4. Добавь env-переменную:

`VITE_API_BASE_URL=https://<твой-backend>.onrender.com/api`

5. Нажми Deploy.

После деплоя проверь, что сайт открывается по URL вида:
`https://<project>.vercel.app`

---

## 4. Если фронт не работает по прямым ссылкам
В `frontend/vercel.json` уже добавлен rewrite на `index.html`, так что SPA-маршруты вроде `/books/1` должны открываться нормально.

---

## 5. Что заливать на GitHub нельзя

Не заливай:
- `.venv/`
- `node_modules/`
- `.env`
- `db.sqlite3`
- `media/`
- `staticfiles/`

Это уже учтено в `.gitignore`.

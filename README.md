# BookCross / BookSwap — Render + Vercel

Готовая версия проекта для развёртывания в связке:
- **Backend**: Django REST на **Render**
- **Frontend**: React + Vite на **Vercel**
- **Database**: PostgreSQL (строка подключения через `DATABASE_URL`)

## Структура
- `backend/` — API, JWT, книги, обмены, отзывы
- `frontend/` — web-клиент
- `DEPLOY.md` — короткая инструкция по Render + Vercel

## Локальный запуск

### Backend
```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scriptsctivate
pip install -r requirements.txt
cp .env.example .env       # Windows: copy .env.example .env
python manage.py migrate
python manage.py runserver
```

### Frontend
```bash
cd frontend
npm install
cp .env.example .env       # Windows: copy .env.example .env
npm run dev
```

## Что уже настроено
- `render.yaml`
- `build.sh`
- `vercel.json`
- `gunicorn`
- `whitenoise`
- `dj-database-url`
- `django-cors-headers`

## Важно
База данных настраивается **на Render backend**, а не на Vercel frontend.

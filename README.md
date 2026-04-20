# BookCross — deploy-ready monorepo

Этот проект переделан из старого рабочего архива в чистый формат для GitHub и деплоя:

- `frontend/` — React + Vite, готов для **Vercel**
- `backend/` — Django REST API, готов для **Render**

## Почему не "всё только на Vercel"
Текущий backend — полноценный Django API с JWT, загрузкой файлов и БД. Технически Vercel поддерживает Python runtime, но для такого проекта проще и надёжнее держать frontend на Vercel, а backend на Render.

## Локальный запуск

### Backend
```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
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

## Деплой
Подробная инструкция — в `DEPLOY.md`.

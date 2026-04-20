# Backend BookSwap

## Что делает backend
- хранит пользователей, книги, заявки на обмен и отзывы
- выдаёт JWT access/refresh токены
- отдаёт данные desktop-клиенту по REST API
- предоставляет Swagger-документацию

## Основные URL
- `/` — краткое описание API
- `/api/health/` — healthcheck
- `/api/docs/` — Swagger
- `/api/schema/` — OpenAPI schema
- `/api/auth/` — авторизация и профиль
- `/api/books/` — книги
- `/api/exchanges/` — обмены
- `/api/reviews/` — отзывы

## Установка
```bash
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

## Ngrok
Чтобы этот backend открывался наружу и команде не нужен был доступ к твоему локальному IP, используй `../ops/ngrok/start_ngrok.py`.

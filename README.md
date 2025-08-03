# Casino Project

Этот проект представляет собой казино с игрой в 21 (Blackjack).

## Архитектура

- **Frontend** - React приложение на порту 3001
- **Backend** - FastAPI сервер на порту 8000
- **Game 21** - игра в Blackjack на порту 5001
- **Database** - PostgreSQL на DigitalOcean (внешняя БД)

## Маршрутизация

- `http://localhost:3001/` - главная страница (React)
- `http://localhost:8000/` - API бэкенда (FastAPI)
- `http://localhost:8000/docs` - Swagger документация API
- `http://localhost:5001/` - игра в 21 (Blackjack)

## База данных

Проект использует внешнюю PostgreSQL базу данных на DigitalOcean:
- **Host**: db-postgresql-ams3-53605-do-user-17871666-0.k.db.ondigitalocean.com
- **Port**: 25060
- **Database**: defaultdb
- **SSL**: require

## Настройка окружения

### 1. Создание .env файла

Перед запуском необходимо создать файл `.env` с кредами базы данных:

```bash
./setup-env.sh
```

Этот скрипт создаст файл `.env` с настройками:
- Креды для подключения к DigitalOcean PostgreSQL
- Настройки приложения
- Переменные окружения для мониторинга

### 2. Ручное создание .env

Если предпочитаете создать файл вручную, скопируйте содержимое из `env.example`:

```bash
cp env.example .env
```

## Быстрый запуск

Используйте скрипт для автоматического запуска с проверкой:

```bash
./start.sh
```

Этот скрипт:
- Проверит, что Docker запущен
- Остановит существующие контейнеры
- Соберет и запустит новые контейнеры
- Проверит подключение к базе данных
- Покажет статус всех сервисов

## Ручной запуск

1. Убедитесь, что у вас установлен Docker и Docker Compose

2. Создайте .env файл (см. раздел "Настройка окружения")

3. Запустите все сервисы:
```bash
docker-compose up -d
```

4. Откройте браузер и перейдите по адресу:
   - `http://localhost:3001/` - главная страница
   - `http://localhost:8000/docs` - API документация
   - `http://localhost:5001/` - игра в 21

## Остановка

```bash
docker-compose down
```

## Просмотр логов

```bash
# Все сервисы
docker-compose logs -f

# Конкретный сервис
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f game-21
```

## Структура проекта

```
├── back/           # FastAPI бэкенд
├── front/          # React фронтенд
├── game/           # Игра в 21 (Blackjack)
├── .env            # Переменные окружения (создается setup-env.sh)
├── env.example     # Пример переменных окружения
├── setup-env.sh    # Скрипт настройки .env
├── start.sh        # Скрипт запуска
└── docker-compose.yml
```

## Переменные окружения

### Backend
- `POSTGRES_HOST` - хост БД
- `POSTGRES_PORT` - порт БД (25060)
- `POSTGRES_DB` - имя базы данных (defaultdb)
- `POSTGRES_USER` - пользователь БД (doadmin)
- `POSTGRES_PASSWORD` - пароль БД
- `POSTGRES_SSLMODE` - режим SSL (require)
- `APP_TITLE` - название приложения
- `APP_NAME` - имя приложения
- `ENV` - окружение (local/prod)
- `DEBUG` - режим отладки
- `SENTRY_DSN` - Sentry DSN (опционально)
- `PROMETHEUS_METRICS_KEY` - ключ для метрик Prometheus

### Frontend
- `REACT_APP_API_URL` - URL API бэкенда

## Устранение проблем

### Проблемы с .env файлом

1. Убедитесь, что файл `.env` существует:
```bash
ls -la .env
```

2. Если файла нет, создайте его:
```bash
./setup-env.sh
```

3. Проверьте права доступа:
```bash
ls -la .env
```
Файл должен иметь права 600 (только для владельца).

### Проблемы с подключением к БД

1. Проверьте, что интернет-соединение стабильно
2. Убедитесь, что IP адрес не заблокирован в DigitalOcean
3. Проверьте логи бэкенда: `docker-compose logs backend`

### Проблемы с SSL

Если возникают проблемы с SSL соединением к БД:
1. Убедитесь, что `POSTGRES_SSLMODE=require`
2. Проверьте, что сертификаты DigitalOcean актуальны
3. Попробуйте перезапустить контейнеры: `docker-compose restart`

### Проблемы с портами

Если порт 3001 занят, измените его в `docker-compose.yml`:
```yaml
ports:
  - "3002:3000"  # Измените 3001 на 3002
```

Если порт 5001 занят, измените его в `docker-compose.yml`:
```yaml
ports:
  - "5002:5000"  # Измените 5001 на 5002
``` 
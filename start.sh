#!/bin/bash

# Скрипт для запуска Casino Project

set -e

echo "🎰 Запуск Casino Project..."

# Проверяем, что Docker запущен
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker не запущен. Запустите Docker и попробуйте снова."
    exit 1
fi

# Останавливаем существующие контейнеры
echo "🛑 Останавливаем существующие контейнеры..."
docker-compose down

# Собираем и запускаем контейнеры
echo "🔨 Собираем и запускаем контейнеры..."
docker-compose up -d --build

# Ждем немного, чтобы сервисы запустились
echo "⏳ Ждем запуска сервисов..."
sleep 10

# Проверяем статус контейнеров
echo "📊 Статус контейнеров:"
docker-compose ps

# Проверяем подключение к БД
echo "🔍 Проверяем подключение к базе данных..."
if docker-compose exec -T backend python -c "
import asyncio
from src.core.database import get_async_session
from sqlalchemy import text

async def test_db():
    try:
        async for session in get_async_session():
            result = await session.execute(text('SELECT 1'))
            print('✅ Подключение к БД успешно')
            break
    except Exception as e:
        print(f'❌ Ошибка подключения к БД: {e}')
        exit(1)

asyncio.run(test_db())
"; then
    echo "✅ База данных доступна"
else
    echo "❌ Проблема с подключением к базе данных"
    echo "📋 Логи бэкенда:"
    docker-compose logs backend
    exit 1
fi

echo ""
echo "🎉 Проект успешно запущен!"
echo ""
echo "🌐 Доступные URL:"
echo "   http://localhost:3001/     - главная страница"
echo "   http://localhost:8000/     - API бэкенда"
echo "   http://localhost:8000/docs - документация API"
echo "   http://localhost:5001/     - игра в 21"
echo ""
echo "📋 Полезные команды:"
echo "   docker-compose logs -f     - просмотр логов"
echo "   docker-compose down        - остановка проекта"
echo "   docker-compose restart     - перезапуск проекта" 
#!/bin/bash

# Скрипт для настройки .env файла

set -e

echo "🔧 Настройка .env файла..."

# Проверяем, существует ли уже .env файл
if [ -f ".env" ]; then
    echo "⚠️  Файл .env уже существует"
    read -p "Хотите перезаписать его? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Отменено"
        exit 1
    fi
fi

# Создаем .env файл с кредами
cat > .env << 'EOF'
# Настройки базы данных DigitalOcean
POSTGRES_HOST=db-postgresql-ams3-53605-do-user-17871666-0.k.db.ondigitalocean.com
POSTGRES_PORT=25060
POSTGRES_DB=defaultdb
POSTGRES_USER=doadmin
POSTGRES_PASSWORD=AVNS_dCeVuxoUFrDYgX6_zbX
POSTGRES_SSLMODE=require

# URL базы данных (без sslmode - SSL настраивается отдельно)
DATABASE_URL=postgresql://doadmin:AVNS_dCeVuxoUFrDYgX6_zbX@db-postgresql-ams3-53605-do-user-17871666-0.k.db.ondigitalocean.com:25060/defaultdb

# Настройки приложения
APP_TITLE=Casino Project
APP_NAME=casino
ENV=local
DEBUG=true

# Настройки мониторинга
SENTRY_DSN=
PROMETHEUS_METRICS_KEY=secret
EOF

# Устанавливаем правильные права доступа
chmod 600 .env

echo "✅ Файл .env создан с кредами базы данных"
echo "🔒 Права доступа установлены (только для владельца)"
echo ""
echo "📋 Содержимое .env файла:"
echo "   POSTGRES_HOST: db-postgresql-ams3-53605-do-user-17871666-0.k.db.ondigitalocean.com"
echo "   POSTGRES_PORT: 25060"
echo "   POSTGRES_DB: defaultdb"
echo "   POSTGRES_USER: doadmin"
echo "   POSTGRES_PASSWORD: AVNS_dCeVuxoUFrDYgX6_zbX"
echo "   POSTGRES_SSLMODE: require"
echo ""
echo "🚀 Теперь можно запустить проект:"
echo "   ./start.sh" 
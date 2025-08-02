#!/bin/bash

# BJFront Setup Script
# Простая проверка зависимостей для работы с Docker

set -e

echo "🚀 BJFront Setup Script"
echo "======================="

# Функция для проверки Docker
check_docker() {
    if ! command -v docker &> /dev/null; then
        echo "❌ Docker не найден. Установите Docker: https://docs.docker.com/get-docker/"
        exit 1
    fi
    
    if ! docker info &> /dev/null; then
        echo "❌ Docker не запущен. Запустите Docker и попробуйте снова."
        exit 1
    fi
    
    echo "✅ Docker работает"
}

# Функция для проверки Make
check_make() {
    if command -v make &> /dev/null; then
        echo "✅ Make доступен"
        return
    fi

    echo "❌ Make не найден. На большинстве систем он уже установлен."
    echo "Для установки:"
    echo "  macOS: xcode-select --install"
    echo "  Ubuntu/Debian: sudo apt-get install make"
    echo "  CentOS/RHEL: sudo yum install make"
    exit 1
}

# Основная функция
main() {
    echo "🔍 Проверяем зависимости..."
    
    # Проверяем Docker
    check_docker
    
    # Проверяем Make
    check_make
    
    echo ""
    echo "🎉 Все готово к работе!"
    echo ""
    echo "📋 Доступные команды:"
    echo "  make build              # Собрать продакшен образ"
    echo "  make build-dev          # Собрать dev образ"
    echo "  make run                # Запустить контейнер"
    echo "  make stop               # Остановить контейнер"
    echo "  make rebuild            # Пересобрать и перезапустить"
    echo ""
    echo "🚀 Для быстрого старта:"
    echo "  make rebuild"
    echo ""
    echo "📱 Приложение будет доступно: http://localhost:3000"
}

# Запуск
main "$@" 
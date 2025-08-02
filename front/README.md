# 🎰 BJFront - Блэкджек Фронтенд

Современное React приложение для игр в казино с поддержкой Docker контейнеризации.

## ✨ Особенности

- 🎮 **React + Vite** - Быстрая разработка с HMR
- 🎨 **TailwindCSS** - Современные стили казино
- 🐳 **Docker Ready** - Простая контейнеризация
- 📱 **Responsive Design** - Адаптивный дизайн

## 📋 Требования

- ✅ **Docker** установлен и запущен
- ✅ **Make** доступен в системе

## 🚀 Быстрый старт

```bash
# Проверка зависимостей
./setup.sh

# Сборка и запуск
make rebuild

# Приложение: http://localhost:3000
```

## 🎮 Доступные игры

- **21 (Блэкджек)** - Классическая карточная игра
- **Нарды** - Настольная игра  
- **Крестики-нолики** - Логическая игра

## 📋 Команды Make

```bash
make build         # Собрать продакшен образ
make build-dev     # Собрать dev образ  
make run           # Запустить контейнер
make stop          # Остановить контейнер
make rebuild       # Пересобрать и перезапустить
```

## 🏗️ Архитектура

```
Docker Container (bjfront)
├── Node.js 18 Alpine
├── Serve (статический сервер)
└── Port 3000
```

## 🛠️ Разработка

### Локальная разработка без Docker
```bash
npm install
npm run dev
# Приложение: http://localhost:5173
```

### С Docker dev режимом
```bash
# Сборка dev образа
make build-dev

# Запуск dev контейнера (интерактивно)
docker run --rm -it -p 5173:5173 -v $(pwd):/app -v /app/node_modules bjfront-dev
```

## 📁 Структура проекта

```
BJFront/
├── src/
│   ├── components/          # React компоненты
│   ├── assets/              # Статические файлы
│   └── data.js              # Данные игр
├── Dockerfile               # Продакшн образ
├── Dockerfile.dev           # Dev образ  
├── Makefile                 # Docker команды
└── setup.sh                 # Скрипт проверки
```

## 🔧 Конфигурация

В `Makefile` можно изменить:

```makefile
# Настройки
IMAGE_NAME = bjfront
CONTAINER_NAME = bjfront-app
PROD_PORT = 3000
DEV_PORT = 5173
```

## 📝 Технологии

- **Frontend**: React 19, Vite, TailwindCSS
- **Containerization**: Docker
- **Build Tool**: Make
- **Web Server**: serve (для продакшена)

## 💡 Примеры использования

### Быстрый деплой
```bash
./setup.sh && make rebuild
```

### Разработка
```bash
npm install && npm run dev
```

### Обновление приложения
```bash
make rebuild
``` 

---

🎲 **Удачной игры!**

## ℹ️ Примечания

- Приложение запускается на порту **3000**
- Dev режим использует порт **5173**
- Контейнер использует непривилегированного пользователя
- Автоматический restart контейнера отключен

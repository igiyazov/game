# 🐳 Docker Setup для BJFront с существующим Traefik

## Структура файлов

- `Dockerfile` - Multi-stage сборка для продакшена с serve
- `Dockerfile.dev` - Версия для разработки с hot reload
- `Makefile` - Управление Docker контейнерами
- `.dockerignore` - Исключения для Docker build

## 📋 Предварительные требования

- ✅ **Traefik уже настроен** на сервере
- ✅ **Docker** установлен и запущен
- ✅ **Make** доступен в системе
- ✅ **Сеть traefik** существует (или будет создана автоматически)

## 🚀 Быстрый старт

### Деплой на сервер
```bash
# Автоматическая проверка зависимостей
./setup.sh

# Деплой приложения
make deploy

# Приложение будет доступно через настроенный Traefik
```

### Локальная разработка
```bash
# Для локального тестирования
make setup-hosts    # Настроить /etc/hosts (если нужно)
make dev            # Запуск в dev режиме
# Приложение: http://localhost:5173
```

## 📋 Доступные команды

```bash
# Показать все команды
make help

# Основные команды
make build            # Собрать продакшен образ
make deploy           # Деплой приложения (рекомендуется)
make up               # Запустить с Traefik
make down             # Остановить
make logs             # Показать логи
make restart          # Перезапустить
make clean            # Очистить всё

# Разработка
make dev              # Запустить dev режим
make build-dev        # Собрать dev образ

# Сети и утилиты
make setup-network    # Создать сеть traefik (если не существует)
make status           # Статус контейнеров
make shell            # Войти в контейнер
make rebuild          # Пересобрать и перезапустить
make setup-hosts      # Настроить /etc/hosts (для локальной разработки)
```

## 🏷️ Traefik Labels

При запуске контейнера автоматически применяются следующие labels:

```bash
--label "traefik.enable=true"
--label "traefik.http.routers.bjfront.rule=Host(`bjfront.local`)"
--label "traefik.http.routers.bjfront.entrypoints=web"
--label "traefik.http.services.bjfront.loadbalancer.server.port=3000"
```

### Для HTTPS добавьте в Makefile:
```makefile
# В команду prod добавьте:
--label "traefik.http.routers.bjfront-secure.rule=Host(`your-domain.com`)" \
--label "traefik.http.routers.bjfront-secure.entrypoints=websecure" \
--label "traefik.http.routers.bjfront-secure.tls=true"
```

## 📦 Архитектура

### Продакшн
- **Base image**: node:18-alpine
- **Web server**: serve (простой SPA сервер)
- **Port**: 3000
- **Размер**: ~50MB
- **Безопасность**: Непривилегированный пользователь

### Разработка
- **Base image**: node:18-alpine
- **Port**: 5173
- **Hot reload**: Да
- **Размер**: ~450MB

## 🌐 Сетевая архитектура

```
Internet → Existing Traefik → BJFront App (3000)
```

**Примечание**: Traefik панель управления и настройки находятся на главном сервере.

## 🔍 Отладка

### Проверить статус приложения
```bash
make status
```

### Посмотреть логи
```bash
make logs
```

### Войти в контейнер
```bash
make shell
```

### Проверить приложение
```bash
make check-app
```

### Сетевая информация
```bash
make network-ls
```

## 🔧 Настройка для продакшена

### Изменение домена
В `Makefile`:
```makefile
HOST_DOMAIN = your-domain.com
```

### Переменные окружения
Добавьте к команде `docker run` в target `prod`:
```makefile
-e NODE_ENV=production \
-e API_URL=https://api.your-domain.com \
```

## 🚀 Деплой

### Простой деплой
```bash
make deploy
```

### Полный цикл (с очисткой)
```bash
make rebuild
```

### CI/CD пример
```yaml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to server
        run: |
          # Предполагается, что Docker и Traefik уже настроены
          make setup-network
          make build
          make up
```

## 📊 Мониторинг

### Проверка здоровья
```bash
make check-app
```

### Статус всех сервисов
```bash
make status
```

## 🤝 Интеграция с другими сервисами

Создайте аналогичные команды для других сервисов:

```makefile
api-deploy:
	docker run -d \
		--name api-server \
		--network traefik \
		--restart unless-stopped \
		--label "traefik.enable=true" \
		--label "traefik.http.routers.api.rule=Host(\`api.your-domain.com\`)" \
		--label "traefik.http.services.api.loadbalancer.server.port=8000" \
		your-api-image
```

## 🛠️ Кастомизация

### Изменение портов
```makefile
PROD_PORT = 3000
DEV_PORT = 5173
```

### Изменение домена
```makefile
HOST_DOMAIN = your-app.com
```

### Добавление переменных окружения
```makefile
prod: build setup-network
	@docker run -d \
		--name $(CONTAINER_NAME) \
		--network $(NETWORK_NAME) \
		-e NODE_ENV=production \
		-e API_URL=https://api.example.com \
		# ... остальные параметры
```

## 🔒 Безопасность

- Непривилегированный пользователь в контейнере
- Минимальный Alpine образ
- Изоляция через Docker сети
- SSL/TLS обрабатывается существующим Traefik
- Автоматический restart при сбоях 
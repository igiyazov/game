# Simple BJFront Docker Management

# Переменные
IMAGE_NAME = bjfront
CONTAINER_NAME = bjfront-app
DEV_CONTAINER = bjfront-dev
PROD_PORT = 3000
DEV_PORT = 5173

.PHONY: build build-dev rebuild run stop

build: ## Собрать продакшен образ
	@echo "🔨 Сборка продакшен образа..."
	docker build -t $(IMAGE_NAME) .

build-dev: ## Собрать dev образ
	@echo "🔨 Сборка dev образа..."
	docker build -f Dockerfile.dev -t $(IMAGE_NAME)-dev .

rebuild: stop build run ## Пересобрать и перезапустить

run: ## Запустить контейнер
	@echo "🚀 Запуск контейнера..."
	docker run -d -p $(PROD_PORT):$(PROD_PORT) --name $(CONTAINER_NAME) $(IMAGE_NAME)
	@echo "✅ Приложение доступно: http://localhost:$(PROD_PORT)"

stop: ## Остановить контейнеры
	@echo "⏹️ Остановка контейнеров..."
	@docker stop $(CONTAINER_NAME) $(DEV_CONTAINER) 2>/dev/null || true
	@docker rm $(CONTAINER_NAME) $(DEV_CONTAINER) 2>/dev/null || true 
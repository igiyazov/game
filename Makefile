.PHONY: help build up down restart logs status clean dev

# Переменные
COMPOSE_FILE = docker-compose.yml
PROJECT_NAME = casino

help: ## Показать справку
	@echo "Доступные команды:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

build: ## Собрать все образы
	docker-compose -f $(COMPOSE_FILE) -p $(PROJECT_NAME) build

up: ## Запустить все сервисы
	docker-compose -f $(COMPOSE_FILE) -p $(PROJECT_NAME) up -d

down: ## Остановить все сервисы
	docker-compose -f $(COMPOSE_FILE) -p $(PROJECT_NAME) down

restart: ## Перезапустить все сервисы
	docker-compose -f $(COMPOSE_FILE) -p $(PROJECT_NAME) restart

logs: ## Показать логи всех сервисов
	docker-compose -f $(COMPOSE_FILE) -p $(PROJECT_NAME) logs -f

status: ## Показать статус сервисов
	docker-compose -f $(COMPOSE_FILE) -p $(PROJECT_NAME) ps

clean: ## Очистить все контейнеры, образы и volumes
	docker-compose -f $(COMPOSE_FILE) -p $(PROJECT_NAME) down -v --rmi all
	docker system prune -f

dev: ## Запустить frontend в режиме разработки
	cd front && npm run dev

# Информация о сервисах
info: ## Показать информацию о сервисах
	@echo "=== Casino Project Services ==="
	@echo "Frontend (React + Game 21): http://localhost:3000"
	@echo "Backend (FastAPI): http://localhost:8000"
	@echo "Database (PostgreSQL): localhost:5433"
	@echo ""
	@echo "API Documentation: http://localhost:8000/docs"
	@echo ""
	@echo "🎮 Игра 21 интегрирована прямо в React приложение!"
	@echo "   При клике на 'Играть' в карточке '21' запустится игра" 
# Переменные
IMAGE_NAME = blackjack-game
CONTAINER_NAME = blackjack-container
PORT = 5001

# Цвета для вывода
GREEN = \033[0;32m
RED = \033[0;31m
YELLOW = \033[0;33m
NC = \033[0m # No Color

.PHONY: help build rebuild run stop clean logs status build-local

# Помощь
help:
	@echo "$(GREEN)Доступные команды:$(NC)"
	@echo "  $(YELLOW)build-local$(NC) - Локально собрать Vite (npm ci + npm run build)"
	@echo "  $(YELLOW)build$(NC)       - Собрать Docker образ (из dist)"
	@echo "  $(YELLOW)rebuild$(NC)     - Пересобрать образ (очистка кэша)"
	@echo "  $(YELLOW)run$(NC)         - Запустить контейнер"
	@echo "  $(YELLOW)stop$(NC)        - Остановить и удалить контейнер"
	@echo "  $(YELLOW)clean$(NC)       - Очистить неиспользуемые образы"
	@echo "  $(YELLOW)logs$(NC)        - Показать логи контейнера"
	@echo "  $(YELLOW)status$(NC)      - Показать статус контейнера"

# Локальная сборка Vite
build-local:
	@echo "$(GREEN)Локальная сборка Vite...$(NC)"
	@[ -d node_modules ] || npm ci
	npm run build
	@echo "$(GREEN)Сборка Vite завершена.$(NC)"

# Сборка образа (только из dist)
build: build-local
	@echo "$(GREEN)Сборка Docker образа (runtime-only)...$(NC)"
	docker build -t $(IMAGE_NAME) .
	@echo "$(GREEN)Образ собран успешно!$(NC)"

# Пересборка образа с очисткой кэша
rebuild: build-local
	@echo "$(GREEN)Пересборка Docker образа с очисткой кэша...$(NC)"
	docker build --no-cache -t $(IMAGE_NAME) .
	@echo "$(GREEN)Образ пересобран успешно!$(NC)"

# Запуск контейнера
run:
	@echo "$(GREEN)Запуск контейнера...$(NC)"
	@if [ $$(docker ps -aq -f name=$(CONTAINER_NAME)) ]; then \
		echo "$(YELLOW)Контейнер уже существует. Останавливаем и удаляем...$(NC)"; \
		docker stop $(CONTAINER_NAME) 2>/dev/null || true; \
		docker rm $(CONTAINER_NAME) 2>/dev/null || true; \
	fi
	docker run -d --name $(CONTAINER_NAME) -p $(PORT):5000 $(IMAGE_NAME)
	@echo "$(GREEN)Контейнер запущен на порту $(PORT)!$(NC)"
	@echo "$(GREEN)Приложение доступно по адресу: http://localhost:$(PORT)$(NC)"

# Остановка контейнера
stop:
	@echo "$(GREEN)Остановка контейнера...$(NC)"
	@if [ $$(docker ps -q -f name=$(CONTAINER_NAME)) ]; then \
		docker stop $(CONTAINER_NAME); \
		docker rm $(CONTAINER_NAME); \
		echo "$(GREEN)Контейнер остановлен и удален!$(NC)"; \
	else \
		echo "$(YELLOW)Контейнер не запущен$(NC)"; \
	fi

# Очистка неиспользуемых образов
clean:
	@echo "$(GREEN)Очистка неиспользуемых Docker образов...$(NC)"
	docker image prune -f
	@echo "$(GREEN)Очистка завершена!$(NC)"

# Показать логи
logs:
	@if [ $$(docker ps -q -f name=$(CONTAINER_NAME)) ]; then \
		docker logs -f $(CONTAINER_NAME); \
	else \
		echo "$(RED)Контейнер не запущен$(NC)"; \
	fi

# Показать статус
status:
	@echo "$(GREEN)Статус контейнера:$(NC)"
	@if [ $$(docker ps -q -f name=$(CONTAINER_NAME)) ]; then \
		echo "$(GREEN)✓ Контейнер запущен$(NC)"; \
		docker ps -f name=$(CONTAINER_NAME) --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"; \
	else \
		echo "$(RED)✗ Контейнер не запущен$(NC)"; \
	fi 
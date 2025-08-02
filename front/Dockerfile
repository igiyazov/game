# Multi-stage build для оптимизации
FROM node:18-alpine AS builder

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json для оптимизации кэша Docker
COPY package*.json ./

# Устанавливаем зависимости
RUN npm ci --only=production=false

# Копируем исходный код
COPY . .

# Собираем приложение для продакшена
RUN npm run build

# Production stage - простой веб-сервер для SPA
FROM node:18-alpine AS production

# Устанавливаем serve глобально
RUN npm install -g serve

# Создаем пользователя без прав root
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# Создаем директорию приложения
WORKDIR /app

# Копируем собранное приложение
COPY --from=builder --chown=nextjs:nodejs /app/dist ./dist

# Переключаемся на непривилегированного пользователя
USER nextjs

# Открываем порт 3000
EXPOSE 3000

# Запускаем serve с SPA поддержкой
CMD ["serve", "-s", "dist", "-l", "3000"] 
# Используем Node.js образ
FROM node:18-alpine

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем файлы зависимостей
COPY package*.json ./

# Устанавливаем зависимости
RUN npm ci --silent

# Копируем исходный код
COPY . .

# Собираем проект
RUN npm run build

# Устанавливаем serve глобально
RUN npm install -g serve

# Открываем порт
EXPOSE 5000

# Запускаем статический сервер
CMD ["serve", "-s", "dist", "-l", "5000"] 
# Runtime-only образ: в контейнер попадают только заранее собранные файлы
FROM node:18-alpine

WORKDIR /app

# Устанавливаем легковесный статический сервер
RUN npm install -g serve

# Копируем только папку dist, собранную вне Docker
COPY dist/ /app/dist/

EXPOSE 3000

# Запускаем сервер статических файлов с поддержкой SPA
CMD ["serve", "-s", "dist", "-l", "3000"]
# Runtime-only образ: только готовые статические файлы
FROM node:18-alpine

WORKDIR /app

# Устанавливаем легковесный статический сервер
RUN npm install -g serve

# Копируем только собранные файлы
COPY dist/ /app/dist/

EXPOSE 5001
CMD ["serve", "-s", "dist", "-l", "5001"] 
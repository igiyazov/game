# Runtime-only образ на nginx: только готовые собранные файлы
FROM nginx:alpine

# Копируем готовые файлы в стандартную папку nginx
COPY dist/ /usr/share/nginx/html/

# Копируем кастомную конфигурацию nginx для SPA
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

# nginx запускается автоматически
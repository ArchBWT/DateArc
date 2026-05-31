FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
ARG VITE_YANDEX_MAPS_API_KEY
ARG VITE_LOOK_ADS_ENABLED=false
ENV VITE_YANDEX_MAPS_API_KEY=$VITE_YANDEX_MAPS_API_KEY
ENV VITE_LOOK_ADS_ENABLED=$VITE_LOOK_ADS_ENABLED
RUN npm run build

FROM node:20-alpine
RUN apk add --no-cache nginx openssl
COPY --from=build /app/dist /usr/share/nginx/html/datearc
COPY nginx.conf /etc/nginx/nginx.conf
COPY subscribe.js /app/subscribe.js
COPY talarc.html /usr/share/nginx/html/index.html
RUN mkdir -p /app/data && echo '[]' > /app/data/emails.json
EXPOSE 80
CMD sh -c "node /app/subscribe.js & nginx -g 'daemon off;'"

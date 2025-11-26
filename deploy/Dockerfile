# build stage
FROM node:18-alpine AS build

WORKDIR /app

# recibir argumentos del build (Dockploy → Dockerfile)
ARG VITE_API_BASE_URL
ARG VITE_RECAPTCHA_SITE_KEY

# exportarlos como variables para Vite
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_RECAPTCHA_SITE_KEY=$VITE_RECAPTCHA_SITE_KEY

COPY package*.json ./
RUN npm ci

COPY . .

# aquí Vite ya tiene acceso a import.meta.env
RUN npm run build

# production stage
FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY deploy/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

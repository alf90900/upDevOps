# Etapa 1: Build
FROM node:18 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install --only=production
COPY . .

# Etapa 2: Producción
FROM node:18-alpine
WORKDIR /app
COPY --from=build /app ./

# Asegurate de tener el archivo newrelic.js copiado
ENV NEW_RELIC_NO_CONFIG_FILE=true
ENV NEW_RELIC_APP_NAME="APIS UP-devOps"
ENV NEW_RELIC_DISTRIBUTED_TRACING_ENABLED=true
ENV NEW_RELIC_LOG=stdout


EXPOSE 3000
CMD ["npm", "start"]

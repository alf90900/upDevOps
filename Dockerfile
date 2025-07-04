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
ENV NEW_RELIC_LICENSE_KEY=5BA1B11DEA2F52D2CA6911931400D5A5EA5DF4AC377E8C9F148E21689F2322B7

EXPOSE 3000
CMD ["npm", "start"]

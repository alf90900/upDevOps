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
ENV NODE_ENV=production
ENV NEW_RELIC_LICENSE_KEY=CDBDACAFA02D255E810E9227DD4206BE1666AAD13ACBEAA5FE5A9EDED60711FA

EXPOSE 3000
CMD ["npm", "start"]

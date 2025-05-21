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
EXPOSE 3000
CMD ["npm", "start"]

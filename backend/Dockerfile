# Usamos una imagen base con Node.js
FROM node:18

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos necesarios
COPY package*.json ./
COPY tsconfig.json ./
COPY .env ./
COPY src ./src

# Instala las dependencias
RUN npm install

# Compila el código TypeScript
RUN npm run build

# Expone el puerto que usará la app
EXPOSE 3000

# Comando por defecto para iniciar la app
CMD ["node", "dist/app.js"]

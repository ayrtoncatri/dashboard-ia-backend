FROM node:20

WORKDIR /app

# Copiar solo lo necesario primero para cachear mejor las dependencias
COPY package*.json ./
COPY tsconfig.json ./
COPY prisma ./prisma

# Instalar dependencias (se instala lo de dependencies y devDependencies)
RUN npm install

# Copiar el código fuente
COPY ./src ./src

# Generar Prisma Client
RUN npx prisma generate

EXPOSE 3001

# Usar npx para correr el servidor en desarrollo (ajusta a tu flujo real)
CMD ["npx", "ts-node", "src/index.ts"]

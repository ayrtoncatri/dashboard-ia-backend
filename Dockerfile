FROM node:20

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./
COPY prisma ./prisma

RUN npm install

COPY ./src ./src

RUN npx prisma generate

EXPOSE 3001

CMD ["npx", "ts-node", "src/index.ts"]

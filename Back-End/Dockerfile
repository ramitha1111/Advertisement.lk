FROM node:18-bookworm-slim

WORKDIR /app

EXPOSE 3000

COPY package*.json ./

RUN npm ci

COPY . .

CMD ["npm", "start"]

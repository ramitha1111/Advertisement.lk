FROM node:18-bookworm-slim

WORKDIR /app

COPY package*.json ./

RUN npm ci

RUN npm install -g vite

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

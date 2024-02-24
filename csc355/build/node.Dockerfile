FROM node:14

WORKDIR /app

COPY package*.json ./

RUN npm install
RUN npm install pg
RUN npm install express

COPY . .

EXPOSE 3000

CMD ["node", "index.js"]
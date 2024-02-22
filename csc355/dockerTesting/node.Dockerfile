FROM node:14

WORKDIR /app

COPY package*.json ./

RUN npm install
RUN npm install pg

COPY . .

EXPOSE 5432

CMD ["node", "index.js"]
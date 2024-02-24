FROM node:14

WORKDIR /app

COPY . .

RUN npm install
RUN npm install pg
RUN npm install express

EXPOSE 3000

CMD ["node", "index.js"]
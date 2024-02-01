const { Pool, Client } = require('pg');
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const path = require('path');


const client = new Client({
  host: "localhost",
  user: "postgres",
  port: 5432,
  password: "21184",
  database: "postgres"
})

client.connect();

client.query('SELECT * FROM users', (err, res) => {
  console.log(err ? err : res.rows)
  //client.end()
  client.end();
})

app.use('/public', express.static(path.join(__dirname, '/public')));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'home.html'));
});

app.get('/create-account', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'create-account.html'));
  });


server.listen(3000, () => {
  console.log('listening on *:3000');
});
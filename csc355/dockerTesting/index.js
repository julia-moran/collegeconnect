const { Client } = require('pg');
const express = require('express');
const app = express();
const path = require('path');

const connectWithRetry = () => {
  const client = new Client({
    user: 'postgres',
    host: 'postgres',
    database: 'collegeconnect',
    password: '0285',
    port: 5432,
  });

  return client.connect((err) => {
    if (err) {
      console.error('Failed to connect to postgres on startup - retrying in 5 sec', err);
      client.end();
      setTimeout(connectWithRetry, 5000);
    } else {
      console.log('Successfully connected to postgres');
    }
  });
};

connectWithRetry();

app.use(express.static(path.join(__dirname)));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'home.html'));
});

app.listen(3000, () => {
  console.log('App listening on port 3000');
});
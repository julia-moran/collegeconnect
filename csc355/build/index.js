const { Client } = require('pg');
const express = require('express');
const app = express();
const path = require('path');

app.use(express.json());

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

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'login.html'));
});

app.get('/create-account', (req, res) => {
  res.sendFile(path.join(__dirname, 'create-account.html'));
});

app.get('/chat-room', (req, res) => {
  res.sendFile(path.join(__dirname, 'chat-room.html'));
});

app.get('/logout', (req, res) => {
  res.sendFile(path.join(__dirname, 'logout.html'));
});

app.get('/profile-view', (req, res) => {
  res.sendFile(path.join(__dirname, 'profile-view.html'));
});

app.listen(3000, () => {
  console.log('App listening on port 3000');
});

//login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const client = new Client({
      user: 'postgres',
      host: 'postgres',
      database: 'collegeconnect',
      password: '0285',
      port: 5432,
    });

    await client.connect();

    const result = await client.query('SELECT * FROM userInfo WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    if (user.password !== password) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    res.status(200).json({ message: 'Login successful!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'An error occurred' });
  }
});
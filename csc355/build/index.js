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


// comment

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
app.post('/post/login', function(req, res) {
  const email = req.body.email;
  const password = req.body.password; // Assuming you're storing hashed passwords

  const query = `
      SELECT * FROM userInfo 
      WHERE email = $1 AND password = $2
  `;
  db.query(query, [email, password])
      .then(user => {
          if (user) {
              // User found, proceed with login
              res.send(user.id.toString());
          } else {
              // User not found, handle error
              res.send("Invalid");
          }
      })
      .catch(err => {
          // Handle error
          res.send("Invalid");
      });
});
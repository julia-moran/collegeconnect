const { Pool } = require('pg');
const express = require('express');
const app = express();
const path = require('path');

app.use(express.json());

const pool = new Pool({
  user: 'ccadmin',
  host: 'postgres',
  database: 'collegeconnect',
  password: '0285',
  port: 5432
});

// connect to pg database with above credentials
const connectWithRetry = async () => {
  try {
    const client = await pool.connect();
    console.log('Successfully connected to postgres');
    client.release();
  } catch (err) {
    console.error('Failed to connect to postgres on startup - retrying in 5 sec', err);
    setTimeout(connectWithRetry, 5000);
  }
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

//  login endpoint to handle user
app.post('/login', async (req, res) => {
  const { email, password } = req.body; //  get email and password from request body

  try {
    const client = await pool.connect();  //  connect client to database

    try {
      const result = await client.query('SELECT * FROM userInfo WHERE email = $1', [email]);  //  query database for user with email
      const user = result.rows[0];  //  get user from result

      if (!user || user.password !== password) {  //  if user does not exist or password is incorrect
        res.status(401).json({ message: 'Invalid credentials' });
        return;
      }

      const userId = user.id; //  get user id

      res.status(200).json({ message: 'Login successful!', id: userId }); //  send success message and user id
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'An error occurred' }); //  if error occurs, send error message
    } finally {
      client.release(); //  release client from database
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not connect to the database' }); //  if error occurs, send error message
  }
});

app.get('/get/classes', (req, res) => {
  client.query('SELECT classcode, classname FROM chatroom', (err, results) => {
    console.log("Sent to index:", err ? err : results.rows);
    res.json(results.rows);
  })
  
});

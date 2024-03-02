const { Pool } = require('pg');
const express = require('express');
const app = express();
const path = require('path');
var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

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

//  serve html files

// launch app at homepage
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

// Get existing emails to see if a user is a Kutztown student
app.post('/compareEmail', async (req, res) => {
  const email = req.body.email;
  console.log("Email to find: " + email);

  try {
    const client = await pool.connect();

    try {
      const result = await client.query('SELECT * FROM userInfo WHERE email = $1', [email]);
      emailResult = result.rows[0];
      
      console.log("Search for email result:" + emailResult);
      if(emailResult == null) {
        console.log("Not found");
        res.status(401).json({ message: 'Email not found' });
        return;
      } else {
        console.log("Found");
        res.status(200).json({ message: 'Email found' });
        
      }

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

app.get('/getClasses', async (req, res) => {
  try {

    const client = await pool.connect();

    try {
      client.query('SELECT classcode, classname FROM chatroom', (err, results) => {
        //console.log("Sent to index:", err ? err : results.rows);
        res.json(results.rows);
      });
    } finally {
      client.release();
    }
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not connect to the database' });
  }
  })
});

app.listen(3000, () => {
  console.log('App listening on port 3000');
});

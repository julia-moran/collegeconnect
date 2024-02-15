const { Pool, Client } = require('pg');
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const path = require('path');
var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


const client = new Client({
  host: "localhost",
  user: "postgres",
  port: 5432,
  password: "21184",
  database: "postgres"
})

client.connect();

app.use('/public', express.static(path.join(__dirname, '/public')));
app.get('/', (req, res) => {
  


  res.sendFile(path.join(__dirname, 'public', 'home.html'));

});

app.get('/create-account', (req, res) => {  

    res.sendFile(path.join(__dirname, 'public', 'create-account.html'));
  });

  app.get('/login', (req, res) => {  

    res.sendFile(path.join(__dirname, 'public', 'login.html'));
  });

  app.get('/profile-view', (req, res) => {  

    res.sendFile(path.join(__dirname, 'public', 'profile-view.html'));
  });

app.get('/get/emails', (req, res) => {
    client.query('SELECT email FROM users', (err, results) => {
      //console.log("Sent to index:", err ? err : results.rows);
      res.json(results.rows);
    //client.end()
    //client.end();
    })
    
});

app.post('/post/userInfo', (req, res) => {
  let id = req.body.id;

  client.query('SELECT * FROM users WHERE id = $1', [id], (err, results) => {
    console.log("Sent to index:", err ? err : results.rows);
    res.json(results.rows[0]);
  })
  
});

app.post('/post/login', (req, res) => {
  let password = req.body.password;
  let email = req.body.email;
  //console.log(email);
  //console.log(password);
  client.query('SELECT id FROM users WHERE email = $1 AND password = $2',
  [email, password],
  (err, results) => {
    console.log(results.rows[0].id);
    if(results.rows == []) {
      //console.log("Invalid");
      res.send("Invalid");
    } else {
      //console.log("Valid");
      res.send((results.rows[0].id).toString());
    }
    //console.log("Sent to index:", err ? err : results.rows);
    //res.json(results.rows);
  })
  
});

app.post('/post/account', (req, res) => {
  console.log(req.body);
  let password = req.body.password;
  let email = req.body.email;
  let first_name = req.body.first_name;
  let last_name = req.body.last_name;
  console.log(email);
  console.log(password);
  client.query('UPDATE users SET first_name = $1, last_name = $2, password = $3 WHERE email = $4',
  [first_name, last_name, password, email], 
  (err, results) => {
    console.log("Sent to index:", err ? err : "Success");
  //  res.json(results.rows);
  //client.end()
  //client.end();
  });
  
});


server.listen(3000, () => {
  console.log('listening on *:3000');
});
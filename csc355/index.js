const { Pool, Client } = require('pg');
const bcrypt = require('bcrypt');
const saltRounds = 10;
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

//Jerome's function to register a user
function registerUser(username, password) {
  bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log('Hashed password', hashedPassword);
    
    client.query('INSERT INTO users (username, password) VALUES ($1, $2)', [username, hashedPassword], (err, results) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log('User registered successfully');
    });
  });
}

app.use('/public', express.static(path.join(__dirname, '/public')));
app.get('/', (req, res) => {
  


  res.sendFile(path.join(__dirname, 'public', 'home.html'));

});

app.get('/create-account', (req, res) => {  

    res.sendFile(path.join(__dirname, 'public', 'create-account.html'));
  });

app.get('/login', (req, res) => {  
  const {email, password} = req.body;

  app.post('/login', async (req, res) => {
    try {
      const client = await Pool.connect();
      const result = await client.query('SELECT * FROM users WHERE email = $1 AND password = $2', [email]);
      const user = result.rows[0];

      if (!user) {
        res.status(401).send('Invalid credentials');
        return;
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        res.status(401).send('Invalid credentials');
        return;
      }
      const userId = user.id;
      const clearance = user.clearance;

      res.status(200).json({ message: 'Login successful!', id: userId, clearance });

    } catch (err) {
      console.error(err);
    }
  });

    res.sendFile(path.join(__dirname, 'public', 'login.html'));
  });

app.get('/logout', (req, res) => {  

    res.sendFile(path.join(__dirname, 'public', 'logout.html'));
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

app.get('/get/classes', (req, res) => {
  client.query('SELECT classcode, classname FROM chatroom', (err, results) => {
    console.log("Sent to index:", err ? err : results.rows);
    res.json(results.rows);
  })
  
});


app.post('/post/userInfo', (req, res) => {
  let id = req.body.id;

  client.query('SELECT * FROM users WHERE id = $1', [id], (err, results) => {
    console.log(results.rows[0]);
    res.json(results.rows[0]);
  })
  
});

app.post('/post/interests', (req, res) => {
  let id = req.body.id;

  client.query('SELECT * FROM interest WHERE userid = $1', [id], (err, results) => {
    console.log(results.rows);
    res.json(results.rows);
  });
});

app.post('/post/classes', (req, res) => {
  let id = req.body.id;

  client.query('SELECT * FROM classlist WHERE userid = $1', [id], (err, results) => {
    console.log(results.rows);
    res.json(results.rows);
  });
});
//Jerome's register user part two
app.post('/register', (req, res) => {
  const { username, password } = req.body;

  // Call the function to register a user
  registerUser(username, password);

  // Send a response back to the client
  res.send('User registered successfully');
});

app.post('/post/login', (req, res) => {
  let password = req.body.password;
  let email = req.body.email;
  console.log(email);
  console.log(password);
  client.query('SELECT id FROM users WHERE email = $1 AND password = $2',
  [email, password],
  (err, results) => {
    console.log(results.rows);
    if(results.rows[0]) {
      res.send((results.rows[0].id).toString());
    } else {
      res.send("Invalid");
    }
  })
  
});

app.post('/post/getID', (req, res) => {
  let email = req.body.email;
  client.query('SELECT id FROM users WHERE email = $1',
    [email],
    (err, results) => {
      console.log((results.rows[0].id).toString());
      res.send((results.rows[0].id).toString());
    });
});

app.post('/post/account', (req, res) => {
  console.log(req.body);
  let password = req.body.password;
  let email = req.body.email;
  let first_name = req.body.first_name;
  let last_name = req.body.last_name;
  let major = req.body.major;
  let minor = req.body.minor;
  let interest1 = req.body.interest1;
  let interest2 = req.body.interest2;
  let interest3 = req.body.interest3;
  if(req.body.interest1 == "Choose an interest") {
    interest1 = "";
  }

  if(req.body.interest2 == "Choose an interest") {
    interest2 = "";
  }

  if(req.body.interest3 == "Choose an interest") {
    interest3 = "";
  }
  //let userID = 0;

  console.log(minor);
  console.log(password);

  client.query('SELECT id FROM users WHERE email = $1',
  [email],
  (err, results) => {
    let userID = results.rows[0].id;
    console.log("ID PLS WORK" + results.rows[0].id);
    console.log("User ID: " + userID);
    client.query("INSERT INTO interest (userid, prompt, interest) VALUES ($1, '1', $2), ($1, '2', $3), ($1, '3', $4)",
      [userID, interest1, interest2, interest3],
      (err, results) => {
        console.log("Sent to index:", err ? err : "Interests inserted");
      })
  }); 


  client.query('UPDATE users SET first_name = $1, last_name = $2, password = $3, major = $5, minor = $6 WHERE email = $4',
  [first_name, last_name, password, email, major, minor], 
  (err, results) => {
    console.log("Sent to index:", err ? err : "Success");
  //client.end()
  //client.end();
  });

});

app.post('/post/classlist', (req, res) => {
  let email = req.body.email;
  let classCodes = req.body.classCodes;

  console.log(classCodes);

  client.query('SELECT id FROM users WHERE email = $1',
    [email],
    (err, results) => {
      console.log((results.rows[0].id).toString());
      let userId = results.rows[0].id;
      
      for(i in classCodes) {
        client.query("INSERT INTO classlist (classcode, userid, email) VALUES ($1, $2, $3)",
        [classCodes[i], userId, email],
        (err, results) => {
          console.log("Sent to index:", err ? err : "Classlist inserted");
        })
      }
    });
  
});

app.post('/update/profileInfo', (req, res) => {
  let userId = req.body.id;
  let major = req.body.major;
  let minor = req.body.minor;
  
  client.query('UPDATE users SET major = $2, minor = $3 WHERE id = $1',
  [userId, major, minor], 
  (err, results) => {
    console.log("Sent to index:", err ? err : "Sucess");
  });
  
});

app.post('/update/interests', (req, res) => {
  let userId = req.body.id;
  let interest1 = req.body.interest1;
  let interest2 = req.body.interest2;
  let interest3 = req.body.interest3;
  
  client.query("UPDATE interest SET interest = $2 WHERE userid = $1 AND prompt = '1'",
  [userId, interest1], 
  (err, results) => {
    console.log("Sent to index:", err ? err : "Sucess");
  });

  client.query("UPDATE interest SET interest = $2 WHERE userid = $1 AND prompt = '2'",
  [userId, interest2], 
  (err, results) => {
    console.log("Sent to index:", err ? err : "Sucess");
  });

  client.query("UPDATE interest SET interest = $2 WHERE userid = $1 AND prompt = '3'",
  [userId, interest3], 
  (err, results) => {
    console.log("Sent to index:", err ? err : "Sucess");
  });
  
});

app.post('/update/classes', (req, res) => {
  let userId = req.body.id;
  let email = req.body.email;
  let classCodes = req.body.classCodes;

  
  client.query('DELETE FROM classlist WHERE userid = $1',
  [userId], 
  (err, results) => {
    console.log("Sent to index:", err ? err : "Deleted");
  });

  for(i in classCodes) {
    client.query("INSERT INTO classlist (classcode, userid, email) VALUES ($1, $2, $3)",
    [classCodes[i], userId, email],
    (err, results) => {
      console.log("Sent to index:", err ? err : "Classlist inserted");
    })
  }
  
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});
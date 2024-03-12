const { Pool } = require('pg');
const express = require('express');
const path = require('path');
var bodyParser = require('body-parser');
const { createServer } = require('node:http');
const { Server } = require('socket.io');

const app = express();
const server = createServer(app);
const io = new Server(server);




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

io.on('connection', (socket) => {
/*
io.on('connection', (socket) => {
  socket.on('chat message', async (roomNum, classCode, threadID, userID, msg, timeSent) => {
  let result;

  try {
    const client = await pool.connect();
    try {  
      client.query("INSERT INTO chatLog (roomNum, classCode, threadID, userID, msg, timeSent) VALUES ($1, $2, $3, $4, $5, $6)",
      [roomNum, classCode, threadID, userID, msg, timeSent], 
      (err, results) => {
        console.log("Message sent: " + msg);
      });

      //io.to(group).emit('chat message', msg, user, group, result.lastID);
    
    } catch (e) {
      console.error('Message failed to send');
      return;
    } finally {
      client.release();
    }
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not connect to the database' });
  }
});
});
*/

  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });


  // Join a room
  socket.on('join-room', async group => {
    /*Citation Source: the socket.join() function was retrieved from
    https://socket.io/docs/v4/tutorial/introduction on October 11, 2023*/ 
    console.log("joined room: " + group);
    socket.join(group)
  });

  // Leave a room
  socket.on('leave-room', groupToLeave => {
    /*Citation Source: the socket.leave() function was retrieved from
    https://socket.io/docs/v4/tutorial/introduction on October 11, 2023*/ 
    console.log("left room: " + groupToLeave);
    socket.leave(groupToLeave);
  });
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
        const userId = emailResult.id;
        console.log("Found");
        res.status(200).json({ message: 'Email found', id: userId });
        
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
});

app.post('/addAccount', async (req, res) => {
  let password = req.body.password;
  let email = req.body.email;
  let major = req.body.major;
  let minor = req.body.minor;

  try {

    const client = await pool.connect();

    try {  
      client.query('UPDATE userInfo SET password = $1, major = $2, minor = $3 WHERE email = $4',
      [password, major, minor, email], 
      (err, results) => {
        console.log("Add account:", err ? err : "Success");
      })
    } finally {
      client.release();
    }
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not connect to the database' });
  }

});

app.post('/addClasses', async (req, res) => {
  let email = req.body.email;
  let classCodes = req.body.classCodes;
  let userID = req.body.id;

  try {

    const client = await pool.connect();

    try {  
      console.log(classCodes);
          
      for(i in classCodes) {
        client.query("INSERT INTO classlist (classcode, userID, email) VALUES ($1, $2, $3)",
        [classCodes[i], userID, email],
        (err, results) => {
          console.log("Sent to index:", err ? err : "Classlist inserted");
        })
      }
    } finally {
      client.release();
    }
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not connect to the database' });
  }

});

app.post('/addInterests', async (req, res) => {
  let userID = req.body.id;
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

  try {

    const client = await pool.connect();

    try {  
      client.query("INSERT INTO userData (userid, prompt, interest) VALUES ($1, '1', $2), ($1, '2', $3), ($1, '3', $4)",
        [userID, interest1, interest2, interest3],
        (err, results) => {
          console.log("Sent to index:", err ? err : "Interests inserted");
        });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'An error occurred' });
    } finally {
      client.release();
    }
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not connect to the database' });
  }

});

app.post('/displayUserInfo', async (req, res) => {
  let userID = req.body.id;

  try {
    const client = await pool.connect();
    try {  
      client.query('SELECT * FROM userInfo WHERE id = $1', [userID], (err, results) => {
        console.log(results.rows[0]);
        res.json(results.rows[0]);
      })
    } finally {
      client.release();
    }
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not connect to the database' });
  }

});

app.post('/displayClasses', async (req, res) => {
  let userID = req.body.id;

  try {
    const client = await pool.connect();
    try {  
      client.query('SELECT * FROM classlist WHERE userid = $1', [userID], (err, results) => {
        console.log(results.rows);
        res.json(results.rows);
      });
    } finally {
      client.release();
    }
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not connect to the database' });
  }
});

app.post('/displayInterests', async (req, res) => {
  let userID = req.body.id;

  try {
    const client = await pool.connect();
    try {  
      client.query('SELECT * FROM userData WHERE userid = $1', [userID], (err, results) => {
        console.log(results.rows);
        res.json(results.rows);
      });
    } finally {
      client.release();
    }
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not connect to the database' });
  }

});

app.post('/updateUserInfo', async (req, res) => {
  let userID = req.body.id;
  let major = req.body.major;
  let minor = req.body.minor;

  try {
    const client = await pool.connect();
    try {  
      client.query('UPDATE userInfo SET major = $2, minor = $3 WHERE id = $1',
      [userID, major, minor], 
      (err, results) => {
        console.log("Sent to index:", err ? err : "User Info updated");
      });
    } finally {
      client.release();
    }
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not connect to the database' });
  }

});

app.post('/updateClasses', async (req, res) => {
  let userID = req.body.id;
  let email = req.body.email;
  let classCodes = req.body.classCodes;

  try {
    const client = await pool.connect();
    try {  
      client.query('DELETE FROM classlist WHERE userid = $1',
      [userID], 
      (err, results) => {
        console.log("Sent to index:", err ? err : "Deleted");
      });
    
      for(i in classCodes) {
        client.query("INSERT INTO classlist (classcode, userid, email) VALUES ($1, $2, $3)",
        [classCodes[i], userID, email],
        (err, results) => {
          console.log("Sent to index:", err ? err : "Classlist inserted");
        })
      }
    } finally {
      client.release();
    }
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not connect to the database' });
  }

});

app.post('/updateInterests', async (req, res) => {
  let userID = req.body.id;
  let interest1 = req.body.interest1;
  let interest2 = req.body.interest2;
  let interest3 = req.body.interest3;

  try {
    const client = await pool.connect();
    try {  
      client.query("UPDATE userData SET interest = $2 WHERE userid = $1 AND prompt = '1'",
      [userID, interest1], 
      (err, results) => {
        console.log("Sent to index:", err ? err : "Sucess");
      });
    
      client.query("UPDATE userData SET interest = $2 WHERE userid = $1 AND prompt = '2'",
      [userID, interest2], 
      (err, results) => {
        console.log("Sent to index:", err ? err : "Sucess");
      });
    
      client.query("UPDATE userData SET interest = $2 WHERE userid = $1 AND prompt = '3'",
      [userID, interest3], 
      (err, results) => {
        console.log("Sent to index:", err ? err : "Sucess");
      });
    } finally {
      client.release();
    }
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not connect to the database' });
  }

});



server.listen(3000, () => {
  console.log('App listening on port 3000');
});

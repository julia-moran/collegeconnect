/************************************************************/
/* Authors: Julia Moran, Jerome Serrao, Thomas Kasper, Jack Hamilton */
/* Course:  CSC355: Software Engineering II */
/* School: Kutztown University of Pennsylvania */
/* Professor Name: Dr. Dylan Schwesinger */
/* Filename: index.js */
/* Purpose: Main hub document for the methods included using JS within the .html and other .js scripts in the application. */
/************************************************************/

const { Pool } = require('pg');
const express = require('express');
const path = require('path');
var bodyParser = require('body-parser');
const { createServer } = require('node:http');
const { Server } = require('socket.io');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const saltRounds = 10;
const app = express();
const server = createServer(app);
const io = new Server(server);
const nodemailer = require('nodemailer');

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

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
      user: 'kucollegeconnect@gmail.com',
      pass: 'czhg jtio psfz bujc',
  },
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

//test users with hashing
async function testUsers() {
  const users = [
    { email: 'admin1@live.kutztown.edu', password: 'password' },
    { email: 'admin2@live.kutztown.edu', password: 'password' },
    { email: 'test1@live.kutztown.edu', password: 'password' },
    { email: 'test2@live.kutztown.edu', password: 'password' },
  ];

  const client = await pool.connect();

  try {
    for (let user of users) {
      const hashedPassword = await bcrypt.hash(user.password, saltRounds);
      await client.query('UPDATE userInfo SET password = $1 WHERE email = $2', [hashedPassword, user.email]);
    }
  } catch (err) {
    console.error(err);
  } finally {
    client.release();
  }
}

testUsers();

app.use(express.static(path.join(__dirname)));

//  serve html files

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'home.html'));
});

app.get('/styles.css', (req, res) => {
  res.sendFile(path.join(__dirname + "styles.css"));
});

app.get('/main', (req, res) => {
  res.sendFile(path.join(__dirname, 'main.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'login.html'));
});

app.get('/createAccount', (req, res) => {
  res.sendFile(path.join(__dirname, 'createAccount.html'));
});

app.get('/chatRoom', (req, res) => {
  res.sendFile(path.join(__dirname, 'chatRoom.html'));
});

app.get('/logout', (req, res) => {
  res.sendFile(path.join(__dirname, 'logout.html'));
});

app.get('/editProfile', (req, res) => {
  res.sendFile(path.join(__dirname, 'editProfile.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin.html'));
});

app.get('/viewProfile', (req, res) => {
  res.sendFile(path.join(__dirname, 'viewProfile.html'));
});

app.get('/directMessage', (req, res) => {
  res.sendFile(path.join(__dirname, 'directMessage.html'));
});

app.get('/forgotPassword', (req, res) => {
  res.sendFile(path.join(__dirname, 'forgotPassword.html'));
});

app.get('/viewProfile/:id', (req, res) => {
  var options = {
    root: path.join(__dirname),
    headers: {
      'id': req.params.id
    }
  }

  res.sendFile('viewProfile.html', options, function (err) {
    if (err) {
      console.log(err);
    }
  })
});

app.get('/directMessage/:id', (req, res) => {
  var options = {
    root: path.join(__dirname),
    headers: {
      'id': req.params.id
    }
  }

  res.sendFile('directMessage.html', options, function (err) {
    if (err) {
      console.log(err);
    }
  })
});


app.get('/searchUser', (req, res) => {
  res.sendFile(path.join(__dirname, 'searchUser.html'));
});

io.on('connection', async (socket) => {

  socket.on('chat message', async (classCode, userID, msg, timeSent) => {
    console.log("Message: ", classCode, userID, msg, timeSent);
    
    let encryptedMessage = encryptMessage(msg);
    try {
      const client = await pool.connect();
      try {  
        client.query("INSERT INTO chatLog (classCode, userID, msg, timeSent) VALUES ($1, $2, $3, $4)",
        [classCode, userID, encryptedMessage, timeSent], 
        (err, results) => {
          console.log("Chat Message. Sent to index:", err ? err : msg);
        });
        try {
          if(classCode !== '') {
            let decryptedMessage = decryptMessage(encryptedMessage);
            io.to(classCode).emit('chat message', classCode, userID, decryptedMessage, timeSent);
          }          
        } catch (e) {
          console.log('Message failed to be recived', e);
        }

      
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

socket.on('thread message', async (classCode, userID, msg, timeSent, threadID) => {
  console.log("Message: ", classCode, userID, msg, timeSent, threadID);
  
  let encryptedMessage = encryptMessage(msg);
  try {
    const client = await pool.connect();
    try {  
      client.query("INSERT INTO chatLog (classCode, userID, msg, timeSent, threadID) VALUES ($1, $2, $3, $4, $5)",
      [classCode, userID, encryptedMessage, timeSent, threadID], 
      (err, results) => {
        console.log("Chat Message. Sent to index:", err ? err : msg);
      });
      try {
        if(threadID !== '') {
          let decryptedMessage = decryptMessage(encryptedMessage);
          io.to(classCode).emit('thread message', classCode, userID, decryptedMessage, timeSent, threadID);
        }          
      } catch (e) {
        console.log('Message failed to be recived', e);
      }

    
    } catch (e) {
      console.error('Message failed to send');
      return;
    } finally {     client.release();
    }
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not connect to the database' });
  }
});

socket.on('create thread', async (classCode, userID, msg, timeSent, threadID) => {
  console.log("Message: ", classCode, userID, msg, timeSent, threadID);
  
  let encryptedMessage = encryptMessage(msg);
  try {
    const client = await pool.connect();
    try {  
      client.query("INSERT INTO chatLog (classCode, userID, msg, timeSent, threadID) VALUES ($1, $2, $3, $4, $5)",
      [classCode, userID, encryptedMessage, timeSent, threadID], 
      (err, results) => {
        console.log("Chat Message. Sent to index:", err ? err : msg);
      });
      try {
        if(threadID !== '') {
          let decryptedMessage = decryptMessage(encryptedMessage);
          io.to(classCode).emit('create thread', classCode, userID, decryptedMessage, timeSent, threadID);
        }          
      } catch (e) {
        console.log('Message failed to be recived', e);
      }

    
    } catch (e) {
      console.error('Message failed to send');
      return;
    } finally {     client.release();
    }
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not connect to the database' });
  }
});

socket.on('direct message', async (toUserID, fromUserID, msg, timeSent) => {
  console.log("Message: ", toUserID, fromUserID, msg, timeSent);

  let chatRoomID = "";
  let encryptedMessage = encryptMessage(msg);
      
  if(toUserID > fromUserID) {
    chatRoomID = toUserID + "+" + fromUserID;
  } else {
    chatRoomID = fromUserID + "+" + toUserID;
  }

  try {
    const client = await pool.connect();
    try {  
      client.query("INSERT INTO directMessage (chatRoomID, toUserID, fromUserID, msg, timeSent) VALUES ($1, $2, $3, $4, $5)",
      [chatRoomID, toUserID, fromUserID, encryptedMessage, timeSent], 
      (err, results) => {
        console.log("Direct Message. Sent to index:", err ? err : msg);
      });

      if(chatRoomID !== '') {
        let decryptedMessage = decryptMessage(encryptedMessage);
        io.to(chatRoomID).emit('direct message', toUserID, fromUserID, decryptedMessage, timeSent);
      }
    
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


  // Join a room
  socket.on('join-room', async group => {
    /*Citation Source: the socket.join() function was retrieved from
    https://socket.io/docs/v4/tutorial/introduction on October 11, 2023*/ 
    console.log("joined room: " + group);
    socket.join(group)

    try {
      const client = await pool.connect();
      try {  
        client.query("SELECT * FROM chatLog WHERE classCode = $1 AND threadID is NULL", [group],
        (err, results) => {
          console.log("Join Room Sent to index:", err ? err : results.rows);
          results.rows.forEach(row => {
            let decryptedMessage = decryptMessage(row.msg);
            socket.emit('chat message', row.classcode, row.userid, decryptedMessage, row.timesent);
          })
          
        });
      
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

    // Private chat
    socket.on('joinPrivateChat', async (toUserID, fromUserID) => {
      /*Citation Source: the socket.join() function was retrieved from
      https://socket.io/docs/v4/tutorial/introduction on October 11, 2023*/
      let chatRoomID = "";
      
      if(toUserID > fromUserID) {
        chatRoomID = toUserID + "+" + fromUserID;
      } else {
        chatRoomID = fromUserID + "+" + toUserID;
      }
      
      console.log("joined room: " + chatRoomID);
      socket.join(chatRoomID);
  
      try {
        const client = await pool.connect();
        try {  
          client.query("SELECT * FROM directMessage WHERE chatRoomID = $1 AND threadID is NULL", [chatRoomID],
          (err, results) => {
            console.log("Private Message Sent to index:", err ? err : results.rows);
            results.rows.forEach(row => {
              let decryptedMessage = decryptMessage(row.msg);
              socket.emit('direct message', row.touserid, row.fromuserid, decryptedMessage, row.timesent);
            })
            
          });
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

    // Thread chat
    socket.on('joinThreadChat', async (classCode, threadID) => {
    try {
      const client = await pool.connect();
      try {  
        client.query("SELECT * FROM chatLog WHERE classCode = $1 AND threadID = $2", [classCode, threadID],
        (err, results) => {
          console.log("Thread Message Sent to index:", err ? err : results.rows);
          results.rows.forEach(row => {
            let decryptedMessage = decryptMessage(row.msg);
            socket.emit('thread message', row.classcode, row.userid, decryptedMessage, row.timesent, row.threadid);
          })
          
        });
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

  app.get('/testChatLog', async (req, res) => {
    //let userID = req.body.id;
  
    try {
      const client = await pool.connect();
      try {  
        client.query('SELECT * FROM directMessage', (err, results) => {
          console.log("TEST Sent to index:", err ? err : results.rows);
        });
      } finally {
        client.release();
      }
      
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Could not connect to the database' });
    }
  
  });

  // Leave a room
  socket.on('leave-room', groupToLeave => {
    /*Citation Source: the socket.leave() function was retrieved from
    https://socket.io/docs/v4/tutorial/introduction on October 11, 2023*/ 
    console.log("left room: " + groupToLeave);
    socket.leave(groupToLeave);
  });
/*
  if (!socket.recovered) {
    try {
      const client = await pool.connect();
      try {  
        client.query("SELECT classCode, userID, msg, timeSent FROM chatLog WHERE class = $1 and threadID = NULL",
        [classCode], 
        (err, results) => {
          results.rows.forEach(row => {
            socket.emit('chat message', classCode, userID, msg, timeSent);
          })
          
        });

        if(classCode !== '') {
          io.to(classCode).emit('chat message', classCode, userID, msg, timeSent);
        }
      
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
  }*/
});

//  login endpoint to handle user
app.post('/login', async (req, res) => {
  const { email, password } = req.body; //  get email and password from request body
  
  try {
    const client = await pool.connect();  //  connect client to database

    try {
      const result = await client.query('SELECT * FROM userInfo WHERE email ILIKE $1', [email]);  //  query database for user with email
      const user = result.rows[0];  //  get user from result
      console.log(user);
      if (!user) {  //  if user does not exist or password is incorrect
        console.log(`Login failed for user: ${email}`); // Log failed login attempt
        res.status(400).json({ message: 'User not found' });
        return;
      }
      console.log(password);
      console.log(user.password);
      //compare hashed password with user provided  password
      const isMatch = await bcrypt.compare(password, user.password);

      console.log('Password match:', isMatch);
      
      if(!isMatch) {
        console.log(`Invalid password attempt for user: ${email}`); // Log failed password attempt
        res.status(400).send('Invalid Password');
        return;
      }

      const userId = user.id; //  get user id
      const clearance = user.clearance; // get user clearance

      res.status(200).json({ message: 'Login successful!', id: userId, clearance: clearance }); //  send success message, user id and clearance
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

// Send an email to verify a user's email
app.post('/sendVerificationEmail', async (req, res) => {
  const email = req.body.email;
  console.log("Email to find: " + email);

  try {
    const client = await pool.connect();

    try {
      const result = await client.query('SELECT * FROM userInfo WHERE email ILIKE $1', [email]);
      emailResult = result.rows[0].email;
      
      console.log("Search for email result:" + emailResult);
      if(emailResult == null) {
        console.log("Not found");
        res.status(401).json({ message: 'Email not found' });
        return;
      } else {
        console.log("Found");
        
        const otp = Math.floor(1000 + Math.random() * 9000);

        const otpExpier = new Date();
        otpExpier.setMinutes(otpExpier.getMinutes() + 1);


        const mailOptions = {
            from: 'kucollegeconnect@gmail.com',
            to: req.body.email,
            subject: 'College Connect Verify Email OTP',
            text: `Your OTP (It expires after 1 minute) : ${otp}`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log("Sending error: ", error);
            } else {
                console.log("Email sent at " + otpExpier);
                res.json({
                    data: otp,
                    timeSent: otpExpier
                })
            }
        });
    
        
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

// Send an email if the user forgets their password
// Source: https://medium.com/@akmuthumala/forgot-and-reset-password-using-nodejs-with-email-otp-57c11514317e
app.post('/sendForgetPasswordEmail', async (req, res) => {
  const email = req.body.email;
  console.log("Email to find: " + email);

  try {
    const client = await pool.connect();

    try {
      const result = await client.query('SELECT * FROM userInfo WHERE email ILIKE $1 AND password IS NOT NULL', [email]);
      emailResult = result.rows[0];
      
      console.log("Search for email result:" + emailResult);
      if(emailResult == null) {
        console.log("Not found");
        res.json({
          data: "Email not found"
        })
        return;
      } else {
        console.log("Found");
        
        const otp = Math.floor(1000 + Math.random() * 9000);

        const otpExpier = new Date();
        otpExpier.setMinutes(otpExpier.getMinutes() + 1);

        const mailOptions = {
            from: 'kucollegeconnect@gmail.com',
            to: req.body.email,
            subject: 'College Connect Password reset OTP',
            text: `Your OTP (It expires after 1 min): ${otp}`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log("Sending error: ", error);
            } else {
                console.log("Email sent at " + otpExpier);
                res.json({
                    data: otp,
                    timeSent: otpExpier
                })
            }
        });
    
        
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

// Get existing emails to see if a user is a Kutztown student
app.post('/compareEmail', async (req, res) => {
  const email = req.body.email;
  console.log("Email to find: " + email);

  try {
    const client = await pool.connect();

    try {
      const result = await client.query('SELECT * FROM userInfo WHERE email ILIKE $1 AND password IS NULL', [email]);
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

app.get('/getMajors', async (req, res) => {
  try {

    const client = await pool.connect();

    try {
      client.query("SELECT major FROM majors ORDER BY CASE WHEN major = 'Undeclared' THEN 0 ELSE 1 END, major", (err, results) => {
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

app.get('/getMinors', async (req, res) => {
  try {

    const client = await pool.connect();

    try {
      client.query("SELECT minor FROM minors ORDER BY CASE WHEN minor = 'None' THEN 0 ELSE 1 END, minor", (err, results) => {
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

app.get('/getInterests', async (req, res) => {
  try {

    const client = await pool.connect();

    try {
      client.query("SELECT interest FROM userInterests ORDER BY CASE WHEN interest = 'None' THEN 0 ELSE 1 END, interest", (err, results) => {
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

  if(req.body.minor == "Choose your minor") {
    minor = "";
  }

  try {

    const client = await pool.connect();

    //hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    res.send('User created');

    try {  
      client.query('UPDATE userInfo SET password = $1, major = $2, minor = $3 WHERE email ILIKE $4',
      [hashedPassword, major, minor, email], 
      (err, results) => {
        console.log("Add account:", err ? err : "Success");
      });
    } finally {
      client.release();
    } 
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not connect to the database' });
  }

});

app.post('/updatePassword', async (req, res) => {
  let password = req.body.password;
  let email = req.body.email;

  try {

    const client = await pool.connect();

    //hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    res.send('User created');

    try {  
      client.query('UPDATE userInfo SET password = $1 WHERE email ILIKE $2',
      [hashedPassword, email], 
      (err, results) => {
        console.log("Add account:", err ? err : "Success");
      });
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

app.post('/updateInterests', async (req, res) => {
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
      await client.query("DELETE FROM userData WHERE userid = $1", [userID]);

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
        if (err) {
          console.error('Error executing query', err.stack);
          res.status(500).json({ error: 'An error occurred while executing the query.' });
        } else {
          console.log("User Info: ", results.rows[0]);
          res.json(results.rows[0]);
        }
      })
    } finally {
      client.release();
    }
  } catch (err) {
    console.error('Error connecting to the database', err.stack);
    res.status(500).json({ error: 'An error occurred while connecting to the database.' });
  }

});

app.post('/displayClasses', async (req, res) => {
  let userID = req.body.id;

  try {
    const client = await pool.connect();
    try {  
      client.query('SELECT classList.classCode, chatRoom.className FROM classList INNER JOIN chatRoom ON chatRoom.classCode = classList.classCode WHERE classList.userID = $1', [userID], (err, results) => {
        if (results.rows.length === 0) {
          res.status(404).json({ message: 'No classes found for this user ID.' });
        } else {
          res.json(results.rows);
        }
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
        //console.log(results.rows);
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

app.post('/searchUsers', async (req, res) => {
  let userID = req.body.id;
  let firstName = req.body.fname;
  let lastName = req.body.lname;
  let major = req.body.major;
  let minor = req.body.minor;

  try {
    const client = await pool.connect();
    try {  
      client.query("SELECT * FROM userInfo WHERE id <> $5 AND (firstName ILIKE $1 OR lastName ILIKE $2 OR major = $3 OR minor = $4) AND password IS NOT NULL",
      [firstName, lastName, major, minor, userID], 
      (err, results) => {
        console.log("Sent to index:", err ? err : results.rows);
        res.json(results.rows);
      });
          /*console.log("Interests", results.rows.interests);
          if(results.rows.interests) {
            console.log(results.rows.interests.length);
            
            for(i in interests) {
              //console.log(interests[i]);
              let sqlStmt = `WITH joinData AS (SELECT  userInfo.id AS id, firstName, lastName, major, minor, 
                ARRAY_AGG(interest) as interests
              FROM userInfo
                INNER JOIN userData on userInfo.id = userData.userID
              GROUP BY userInfo.id)
              SELECT id, firstName, lastName, major, minor, interests
              FROM joinData
              WHERE id <> 19 AND (firstName = '' OR lastName = '' OR major = '' OR minor = '' OR interests[` + (parseInt(i) + 1) + `] = 'Reading');`;
              console.log(sqlStmt)
              client.query(sqlStmt,
              [], 
              (err, results) => {
                console.log("Sent to index:", err ? err : results.rows);
                res.json(results.rows);
              });
            }          
          
//select userInfo.id, firstName, lastName, major, minor, interest from userInfo left join userData on userInfo.id = userData.userID where interest = 'Music';
      //SELECT userInfo.id, firstName, lastName, major, minor, interest FROM userInfo LEFT JOIN userData ON userInfo.id = userData.userID WHERE userInfo.id <> $5 AND (firstName = $1 OR lastName = $2 OR major = $3 OR minor = $4)
      //if(interests) {

      
      });*/ 
/*
      } else {
        client.query(` SELECT id, firstName, lastName, major, minor
          FROM userInfo
          WHERE id <> $5 AND (firstName = $1 OR lastName = $2 OR major = $3 OR minor = $4);`,
          [firstName, lastName, major, minor, userID], 
          (err, results) => {
            console.log("Sent to index:", err ? err : results.rows);
            res.json(results.rows);
          });
      }

     */ 
      
    } finally {
      client.release();
    }
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not connect to the database' });
  }

});

app.post('/searchInterests', async (req, res) => {
  let userID = req.body.id;
  let interests = req.body.interests;
  let resultsToSend = [];

  try {
    const client = await pool.connect();
    try {  
      
      for(i in interests) {
        client.query("SELECT id, firstName, lastName, major, minor, interest, password FROM userInfo INNER JOIN userData on id = userID WHERE id <> $1 AND interest = $2 AND password IS NOT NULL",
        [userID, interests[i]], 
        (err, results) => {
          console.log("Sent to index:", err ? err : results.rows);
          resultsToSend = resultsToSend.concat(results.rows);
          //console.log("Between Search Interests Sent to index: ", resultsToSend);
        });
      }
      setTimeout(function(){
      //if(resultsToSend.length > 0) {
        console.log("Search Interests Sent to index: ", resultsToSend);
        res.json(resultsToSend);            
      //}
      }, 20);
    } finally {
      client.release();
    }
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not connect to the database' });
  }

});

app.post('/searchClasses', async (req, res) => {
  let userID = req.body.id;
  let classCodes = req.body.classCodes;
  let resultsToSend = [];

  try {
    const client = await pool.connect();
    try {  
      
      for(i in classCodes) {
        client.query("SELECT userInfo.id, firstName, lastName, major, minor, classCode, password FROM userInfo INNER JOIN classList on userInfo.id = userID WHERE userInfo.id <> $1 AND classCode = $2 AND password IS NOT NULL",
        [userID, classCodes[i]], 
        (err, results) => {
          resultsToSend = resultsToSend.concat(results.rows);
        });
      }
      setTimeout(function(){
        console.log("Search Classes Sent to index: ", resultsToSend);
        res.json(resultsToSend);            
      }, 10);
    } finally {
      client.release();
    }
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not connect to the database' });
  }

});

app.post('/searchForSharedClasses', async (req, res) => {
  let userID = req.body.id;
  let searchedUserID = req.body.searchedUserID;

  try {
    const client = await pool.connect();
    try {  
      client.query("SELECT c1.classCode FROM classList as c1 INNER JOIN classList as c2 ON c1.classCode = c2.classCode  WHERE c1.userID = $1 AND c2.userID = $2",
      [userID, searchedUserID], 
      (err, results) => {
        console.log("Sent to index:", err ? err : results.rows);
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

app.post('/getUsersWithChatHistory', async (req, res) => {
  let userID = req.body.id;

  try {
    const client = await pool.connect();
    try {  
      client.query("SELECT DISTINCT userInfo.id, firstName, lastName FROM userInfo INNER JOIN directMessage ON toUserID = userInfo.id OR fromUserID = userInfo.id WHERE userInfo.id <> $1 AND (toUserID = $1 OR fromUserID = $1)",
      [userID], 
      (err, results) => {
        console.log("Sent to index:", err ? err : results.rows);
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

app.post('/getThreads', async (req, res) => {
  //let userID = req.body.id;
  let classCode = req.body.classCode;

  try {
    const client = await pool.connect();
    try {  
      client.query("SELECT DISTINCT threadID FROM chatLog WHERE classCode = $1 AND threadID IS NOT NULL",
      [classCode], 
      (err, results) => {
        console.log("Sent to index:", err ? err : results.rows);
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

app.post('/deleteThread', async (req, res) => {
  //let userID = req.body.id;
  let classCode = req.body.classCode;
  let threadID = req.body.threadID

  try {
    const client = await pool.connect();
    try {  
      client.query("DELETE FROM chatLog WHERE classCode = $1 AND threadID = $2",
      [classCode, threadID], 
      (err, results) => {
        console.log(err ? err : "Thread deleted");
        res.send(threadID);
      });
    } finally {
      client.release();
    }
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not connect to the database' });
  }

});

app.get('/getAdmins', async (req, res) => {
  try {
    const client = await pool.connect();
    try {  
      client.query("SELECT * FROM userInfo WHERE clearance = true",
      (err, results) => {
        //console.log("Admins: ", err ? err : results.rows);
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

app.post('/getStudentsInClass', async (req, res) => {
  let classCode = req.body.classCode;

  try {
    const client = await pool.connect();
    try {  
      client.query("SELECT userInfo.id, firstName, lastName FROM userInfo INNER JOIN classList ON userInfo.id = classList.userID WHERE classCode = $1 ORDER BY lastName",
      [classCode],
      (err, results) => {
        //console.log("Students: ", err ? err : results.rows);
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

app.post('/getStudentsNotInClass', async (req, res) => {
  let classCode = req.body.classCode;

  try {
    const client = await pool.connect();
    try {  
      client.query("SELECT userInfo.id, firstName, lastName FROM userInfo LEFT JOIN classList ON userInfo.id = classList.userID WHERE classCode <> $1 OR classCode IS NULL ORDER BY lastName",
      [classCode],
      (err, results) => {
        //console.log("Students: ", err ? err : results.rows);
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

app.post('/removeStudentFromClass', async (req, res) => {
  let classCode = req.body.classCode;
  let userID = req.body.userID;

  try {
    const client = await pool.connect();
    try {  
      client.query("DELETE FROM classList WHERE classCode = $1 AND userID = $2",
      [classCode, userID],
      (err, results) => {
        console.log(err ? err : "User with ID " + userID + " removed from class " + classCode);
        res.json({ message: 'Operation successful.' });
      });
    } finally {
      client.release();
    }
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not connect to the database' });
  }

});

app.post('/addStudentToClass', async (req, res) => {
  let classCode = req.body.classCode;
  let userID = req.body.userID;

  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM userInfo WHERE id = $1', [userID]);
    try {  
      if (result.rows.length > 0) {
        const email = result.rows[0].email;
          client.query("INSERT INTO classlist (classcode, userID, email) VALUES ($1, $2, $3)",
          [classCode, userID, email],(err, results) => {
            console.log("User with ID " + userID + " added to class " + classCode);
            res.json({ message: 'Operation successful.' });
          })            
      } else {
        res.status(404).json({ message: 'User not found.' });
      }
    } finally {
      client.release();
    }
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not connect to the database' });
  }
});

// Jerome's attempt at encryption and decryption
// Function to generate RSA key pairs
// source:https://stackoverflow.com/questions/8520973/how-to-create-a-pair-private-public-keys-using-node-js-crypto
// source #2: https://nodejs.org/api/crypto.html

function generateKeyPair() {
  return crypto.generateKeyPairSync('rsa', {
    modulusLength: 4096,
    publicKeyEncoding: {
      //public key format
      type: 'spki',
      format: 'pem'
    },
    privateKeyEncoding: {
      //private key format
      type: 'pkcs8',
      format: 'pem'
    }
  });
}
// Attempt at encrypting messages for recipients
// Source: https://dev.to/halan/4-ways-of-symmetric-cryptography-and-javascript-how-to-aes-with-javascript-3o1b
function encryptMessage(message) {
  salt = crypto.randomBytes(16);
  iv = crypto.randomBytes(16);
  key = crypto.pbkdf2Sync('my password', salt, 100000, 256/8, 'sha256');
  
  cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  
  cipher.write(message);
  cipher.end()
  
  encrypted = cipher.read();
  console.log({
    iv: iv.toString('base64'),
    salt: salt.toString('base64'),
    encrypted: encrypted.toString('base64'),
    concatenned: Buffer.concat([salt, iv, encrypted]).toString('base64')
  });
  
  return Buffer.concat([salt, iv, encrypted]).toString('base64');
  /*
 
  // Generate a random symmetric key and initalization vector
  // 256 bit key and 128 bit iv
  const symmetricKey = crypto.randomBytes(32);
  const iv = crypto.randomBytes(16);

  // Encrypt message using AES
  const cipher = crypto.createCipheriv('aes-256-cbc', symmetricKey, iv);
  let encryptedMessage = cipher.update(message, 'utf8', 'hex');
  encryptedMessage += cipher.final('hex');

  // Encrypt symmetric key using RSA public key
  //const encryptedKeys = recipients.map(recipient => {
    const encryptedKeys = {
      recipientName: recipientName,
      encryptedSymmetricKey: crypto.publicEncrypt(
        {
          key: recipientPublicKey,
          padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
          oaepHash: 'sha256',
        },
        symmetricKey).toString('base64')
      };
   // });
  // Return the encrypted message and encrypted symmetric key and initialization vector
  return {encryptedMessage,encryptedKeys,iv };
*/
}

// attempt to decrypt messages using private ket via function
function decryptMessage(encryptedMessage) {
  encrypted = Buffer.from(encryptedMessage, 'base64');
  const salt_len = iv_len = 16;
  
  salt = encrypted.slice(0, salt_len);
  iv = encrypted.slice(0+salt_len, salt_len+iv_len);
  key = crypto.pbkdf2Sync('my password', salt, 100000, 256/8, 'sha256');
  
  decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  
  decipher.write(encrypted.slice(salt_len+iv_len));
  decipher.end();
  
  decrypted = decipher.read();
  return decrypted.toString();
  /*
  try {
    let decryptedMessage = null;
    let decryptedSymmetricKey = null;
    try {

  
  // goes through each encrypted key and decrypts the symmetric key
    //encryptedKeys.forEach(keyInfo => {
      decryptedSymmetricKey = crypto.privateDecrypt(
        {
          key: privateKey,
          padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
          oaepHash: 'sha256',
        },
        Buffer.from(encryptedKeys.encryptedSymmetricKey, 'base64')
      );

      console.log("decryptedSymmetricKey", decryptedSymmetricKey.toString('hex'));
    } catch (error) {
      console.log("error getting key: ", error)
    }
  // will work if decryption of symmetric key is successful
if( decryptedSymmetricKey) {
  // Decrypt the message using the symmetric key and initialization vector
  const decipher = crypto.createDecipheriv('aes-256-cbc', decryptedSymmetricKey, iv);
  decryptedMessage = decipher.update(encryptedMessage, 'hex', 'utf8');
  decryptedMessage += decipher.final('utf8');
  }
    console.log("decryptedMessage", decryptedMessage);

return decryptedMessage;
  } catch(error) {
    console.error("error decrypting message", error);
    return null;
  }*/
}
module.exports = { generateKeyPair, encryptMessage, decryptMessage };

server.listen(3000, () => {
  console.log('App listening on port 3000');
});

// admin functionality
app.post('/admin', async (req, res) => {
  const { email, clearance, operation, userEmail, userClearance, userFirstName, userLastName } = req.body;

  const client = await pool.connect();

  try {
    const result = await client.query('SELECT * FROM userInfo WHERE email = $1', [email]);

    if (result.rows.length > 0) {
      const user = result.rows[0];
      console.log(user); // Log the user data to the console

      if (user.clearance !== true) {
        return res.status(403).json({ message: 'You do not have admin clearance.', userData: user });
      }

      switch (operation) {
        case 'delete':
          await client.query('DELETE FROM userInfo WHERE email ILIKE $1', [userEmail]);
          console.log(`User with email ${userEmail} deleted.`);
          break;
        case 'alter':
          await client.query('UPDATE userInfo SET firstName = $1, lastName = $2, clearance = $3, major = $4, minor = $5 WHERE email ILIKE $6', [userFirstName, userLastName, userClearance, userMajor, userMinor, userEmail]);
          console.log(`User with email ${userEmail} updated.`);
          break;
        case 'create':
          await client.query('INSERT INTO userInfo (email, clearance, firstName, lastName) VALUES ($1, $2, $3, $4)', [userEmail, userClearance, userFirstName, userLastName]);
          console.log(`User with email ${userEmail} created.`);
          break;
        default:
          return res.status(400).json({ message: 'Invalid operation.' });
      }

      res.json({ message: 'Operation successful.' });
    } else {
      res.status(404).json({ message: 'User not found.' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'An error occurred.' });
  } finally {
    client.release();
  }
});
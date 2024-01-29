/*
  Author:         Julia Moran
  Creation Date:  October 11, 2023
  Course:         CSC354
  Professor Name: Dr. Schwesinger
  Filename:       index.js
  Description:    Uses sockets to emit messages, join and
                  leave rooms, and save messages to the database
*/
/*************************SOURCES CITED***************************************/
/*
  Author:         Socket.io (Github committed by Damien Arrachequesne)
  Filename:       index.js
  Retrieved Date: October 11, 2023
  Retrieved from: https://socket.io/docs/v4/tutorial/introduction
                  https://github.com/socketio/chat-example/blob/main/index.js
  Note:           The methods for initializing the project, storing messages
                  in the database, and emitting messages were based on the
                  methods outlined in the Socket.io Getting Started tutorial.

  Author:         Socket.io
  Retrieved Date: October 11, 2023
  Retrieved from: https://socket.io/docs/v3/rooms/
  Note:           The socket.join, socket.leave, and io.leave methods were retrieved
                  from the Socket.io Rooms tutorial.
*/

const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const path = require('path');

async function main() {

  /*Citation Source: this method of creating a database was
    based on the method described in 
    https://socket.io/docs/v4/tutorial/introduction on October 11, 2023*/ 
  // Open the database file
  const db = await open({
    filename: 'chat.db',
    driver: sqlite3.Database
  });

  // Create the table to hold messages if it does not already exist
  await db.exec(`
    CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        client_offset TEXT UNIQUE,
        content TEXT,
        from_user TEXT,
        class TEXT
    );
    
  `);

  /*Citation Source: this method of initializing the server was
    based on the method described in 
    https://socket.io/docs/v4/tutorial/introduction on October 11, 2023*/ 
  const app = express();
  const server = createServer(app);
  const io = new Server(server, {
    connectionStateRecovery: {}
  });


  // Get the style.css, index.html, and chat.js files
  /*Citation Source: this method of serving the HTML was
    based on the method described in 
    https://socket.io/docs/v4/tutorial/introduction on October 11, 2023*/ 
  app.use('/public', express.static(path.join(__dirname, '/public')));
  app.get('/', (req, res) => {
      res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });

  /*Citation Source: this method of integrating socket.io was
    based on the method described in 
    https://socket.io/docs/v4/tutorial/introduction on October 11, 2023*/ 
  io.on('connection', async (socket) => {
    // Send a message to the selected chat
    /*Citation Source: the method of adding inserted messages to the database
    was based on the method described in 
    https://socket.io/docs/v4/tutorial/introduction on October 11, 2023*/ 
    socket.on('chat message', async (msg, user, group) => {
      let result;
      try {
        // Add the messages to the table
        result = await db.run('INSERT INTO messages (content, from_user, class) VALUES ((?), (?), (?))', msg, user, group);
        
        // Emit the message to the selected chat
        /*Citation Source: the io.to() function was retrieved from
        https://socket.io/docs/v4/tutorial/introduction on October 11, 2023*/ 
        if(group !== '') {
          io.to(group).emit('chat message', msg, user, group, result.lastID);
        }
      } 
      // Handle the error
      catch (e) {
        console.error('Message failed to send');
        return;
      }
    });

    // Join a room
    socket.on('join-room', async group => {
      /*Citation Source: the socket.join() function was retrieved from
      https://socket.io/docs/v4/tutorial/introduction on October 11, 2023*/ 
      //console.log("joined room: " + group);
      socket.join(group)

      // Display all messages in the selected chat
      let rows = await db.all('SELECT id, content, from_user, class FROM messages WHERE class = ?', group)
      rows.forEach(row => {
        socket.emit('chat message', row.content, row.from_user, row.class, row.lastID);
      })
    });

    // Leave a room
    socket.on('leave-room', groupToLeave => {
      /*Citation Source: the socket.leave() function was retrieved from
      https://socket.io/docs/v4/tutorial/introduction on October 11, 2023*/ 
      //console.log("left room: " + groupToLeave);
      socket.leave(groupToLeave);
    });

    // Recover messages when the page is reloaded or disconnected
    /*Citation Source: this method of recovering messages in case of disconnection was
    based on the method described in 
    https://socket.io/docs/v4/tutorial/introduction on October 11, 2023*/ 
    if (!socket.recovered) {
      try {
        // Select the messages from the table
        await db.each('SELECT id, content, from_user FROM messages WHERE id > ?',
          [socket.handshake.auth.serverOffset || 0],
          (_err, row) => {
            // Emit the recovered messages
            socket.emit('chat message', row.content, row.from_user, row.lastID);
          }
        )
      } 
      // Handle the error
      catch (e) {
        console.error('Messages failed to be recovered');
      }
    }
  });

  // Listen for the server
  /*Citation Source: this method of listening for the server was
    based on the method described in 
    https://socket.io/docs/v4/tutorial/introduction on October 11, 2023*/ 
  server.listen(process.env.PORT || 3000, '0.0.0.0', () => {
      console.log('server running at http;//localhost:3000');
  });
}

main();
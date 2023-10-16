const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

async function main() {
  // open the database file
  const db = await open({
    filename: 'chat.db',
    driver: sqlite3.Database
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        client_offset TEXT UNIQUE,
        content TEXT,
        from_user TEXT,
        class TEXT
    );
    
  `);

const app = express();
const server = createServer(app);
const io = new Server(server, {
  connectionStateRecovery: {}
});

app.get('/', (req, res) => {
    res.sendFile(join(__dirname, 'index.html'));
});

io.on('connection', async (socket) => {
  socket.on('chat message', async (msg, user, group) => {
    let result;
    try {
      result = await db.run('INSERT INTO messages (content, from_user, class) VALUES ((?), (?), (?))', msg, user, group);
    } catch (e) {
      // TODO handle the failure
      return;
    }

    if(group === '') {
      io.emit('chat message', msg, user, group, result.lastID);
    }
    else {
      io.to(group).emit('chat message', msg, user, group, result.lastID);
    }
  });

  socket.on('join-room', async group => {
    console.log("joined room: " + group);
    socket.join(group)
    let rows = await db.all('SELECT id, content, from_user, class FROM messages WHERE class = ?', group)
    rows.forEach(row => {
      socket.emit('chat message', row.content, row.from_user, row.class, row.lastID);
    })
  });

  socket.on('leave-room', groupToLeave => {
    console.log("left room: " + groupToLeave);
    socket.leave(groupToLeave);
  });

  if (!socket.recovered) {
    try {
      await db.each('SELECT id, content, from_user FROM messages WHERE id > ?',
        [socket.handshake.auth.serverOffset || 0],
        (_err, row) => {
          socket.emit('chat message', row.content, row.from_user, row.lastID);
        }
      )
    } catch (e) {
      // something went wrong
    }
  }
});

server.listen(3000, () => {
    console.log('server running at http;//localhost:3000');
});
}

main();
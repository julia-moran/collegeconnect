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
        from_user TEXT
    );
    
  `);

const app = express();
const server = createServer(app);
const io = new Server(server, {
  connectionStateRecovery: {}
});

app.get('/', (req, res) => {
    res.sendFile(join('C:/Users/jemis/collegeconnect/prototype', 'index.html'));
});

io.on('connection', async (socket) => {
  socket.on('chat message', async (msg, user) => {
    let result;
    try {
      result = await db.run('INSERT INTO messages (content, from_user) VALUES ((?), (?))', msg, user);
    } catch (e) {
      // TODO handle the failure
      return;
    }
    io.emit('chat message', msg, user, result.lastID);
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
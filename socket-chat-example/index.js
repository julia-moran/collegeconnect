const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');

const app = express();
const server = createServer(app);
const io = new Server(server, {
  connectionStateRecovery: {}
});

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'index.html'));
});

/*io.on('connection', (socket) => {
  socket.on("private message", ({ content, to }) => {
    socket.to(to).emit("private message", {
      content,
      from: socket.id,
    });
  });
  socket.on('chat message', (msg, group) => {
    if(group === '') {
      io.emit('chat message', msg);
    } else {
      io.to(group).emit('chat message', msg);
    }
  })
  socket.on('join-room', group => {
    socket.join(group)
  })*/

  io.on('connection', (socket) => {
    socket.on('chat message', (msg, user, group) => {
      //if(group === '') {
        //let msg = data.msg;
        //let user = data.user;
        console.log("in io: " + msg);
        io.emit('chat message', msg, user);
        console.log("in io: " + user);
        //socket.emit('chat message', user);
      //} else {
      //  io.to(group).emit('chat message', data.msg);
      //}
    })

  
    socket.on('join-room', group => {
      socket.join(group)
    })
});
server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});
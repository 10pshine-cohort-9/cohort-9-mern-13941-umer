const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
require('dotenv').config();

let io;

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE']
    }
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth.token || socket.handshake.headers.token;
    if (!token) {
      return next(new Error('Authentication error: Token missing'));
    }
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id; // Verified ID save kar li
      next();
    } catch (err) {
      next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on('connection', (socket) => {

    socket.join(`user_${socket.userId}`);
  });

  return io;
};

const getIo = () => {
  return io;
};

module.exports = {
    initSocket,
    getIo
};
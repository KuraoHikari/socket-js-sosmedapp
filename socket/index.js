const io = require('socket.io')(8900, {
  cors: {
    origin: 'http://localhost:3000',
  },
});

let users = [];

const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) && users.push({ userId, socketId });
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

io.on('connection', (socket) => {
  //when ceonnect
  console.log('a user connected.');
  socket.on('addUser', (userId) => {
    addUser(userId, socket.id);
    // console.log(users)
    // console.log('🚀 ~ file: index.js:21 ~ io.on ~ users:', users);
    io.emit('getUsers', users);
  });

  socket.on('sendMessage', ({ senderId, receiverId, text }) => {
    const user = getUser(receiverId);
    io.to(user.socketId).emit('getMessage', {
      senderId,
      text,
    });
  });

  socket.on('disconnect', () => {
    removeUser(socket.id);
    // console.log('🚀 ~ file: index.js:21 ~ io.on ~ users:', users);
    io.emit('getUsers', users);
  });
});

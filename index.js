const http = require("http")
const express = require("express")
const app = express()
const port = process.env.PORT || 8080
const server = http.createServer(app)

const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

let users = [];

//add user
const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};

//remove user
const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

//get receiver
const getReceiver = (receiverId) => {
  return users.find((user) => user.userId === receiverId);
};

io.on("connection", (socket) => {
  //on connection
  console.log("user connected");
  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
    io.emit("getUsers", users);
  });

  //send and get message
  socket.on("sendMessage", ({ senderId, receiverId, text }) => {
    const user = getReceiver(receiverId);
    user && user.socketId && io.to(user.socketId).emit("getMessage", { senderId, text });
  });

  //on disconnection
  socket.on("disconnect", () => {
    console.log("user disconnected");
    removeUser(socket.id);
    io.emit("getUsers", users);
  });
});

server.listen(port, () => {
  console.log(`listening on ${port}`);
})

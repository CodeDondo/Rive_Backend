const express = require("express");
const app = express();
const http = require("http");
const PORT = 3000;

// Create Express http server
const server = http.createServer(app);

// Server listens on port
server.listen(PORT, () => {
  console.log(`listening on *:${PORT}`);
});

// Initialize Socket IO on server
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "http://127.0.0.1:5500",
  },
});

// Here we need to create the states for the rive animation and
// set up an interval that updates the values

let numHealth = 0;


setInterval(() => {
  if (numHealth > 0) {
      numHealth = numHealth- 1;
  }

  io.sockets.emit("status", { health: numHealth });
}, 1000);

// A user connects to the server (opens a socket)
io.sockets.on("connection", function (socket) {
  // Server recieves a ping and responds with an emit event (sends a message to all connected sockets)
  io.sockets.emit("greet", { message: "Server says hello" });

  socket.on("rave", (data) => {
    numHealth = numHealth + 5;
    console.log("Recieved client ping: ", data);

    io.sockets.emit("raving", { message: "is raving" });
  });
});

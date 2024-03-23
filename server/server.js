const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();

const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User connected`);

  socket.on("message", (roomID, message) => {
    console.log(roomID, message);

    if(roomID.length){
      io.to(roomID).emit("message", message)
    }
    else {
      io.emit("message", message);
    }
  });

  socket.on("joinRoom", (roomID)=>{
    console.log("Joining room: "+ roomID)
    socket.join(roomID);
  })

  socket.on("disconnect", ()=>{
    console.log("User disconnected");
  })
});

httpServer.listen(4000, () => {
  console.log("App is listening on port 4000");
});

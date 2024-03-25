const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const fs = require('fs')

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

  socket.on("leaveRoom", (roomID)=>{
    console.log("Leaving room: "+ roomID)
    socket.leave(roomID)
  })

  socket.on("uploadFile", (uploadedFile, roomID) => {
    console.log(uploadedFile, roomID);

    io.to(roomID).emit(uploadedFile);
  })
});

httpServer.listen(4000, () => {
  console.log("App is listening on port 4000");
});

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const fs = require("fs");

const app = express();

const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "https://shareboard-v2.vercel.app",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User connected`);

  socket.on("message", (roomID, message, username) => {
    console.log(roomID, message, username);

    if (roomID.length) {
      io.to(roomID).emit("message", message);
    } else {
      // io.emit("message", message);
    }
  });

  socket.on("joinRoom", (roomID) => {
    console.log("Joining room: " + roomID);
    socket.join(roomID);
  });

  socket.on("leaveRoom", (roomID) => {
    console.log("Leaving room: " + roomID);
    socket.leave(roomID);
  });

  socket.on("uploadFile", (uploadedFile, roomID) => {
    const buffer = Buffer.from(uploadedFile);
    console.log(buffer, roomID);
    io.to(roomID).emit("downloadFile", { buffer, roomID });
    
    socket.on("downloadFile", async (uploadedFile) => {
      let FT = await import("file-type");

      const { ext, mime } = await FT.fileTypeFromBuffer(buffer);

      const fileName = `file_${Date.now()}.${ext}`;

      fs.writeFile(fileName, buffer, (err) => {
        if (err) {
          console.error("Error writing file:", err);
        } else {
          console.log("File written successfully.");
        }
      });
    });
  });
});

httpServer.listen(4000, "0.0.0.0");

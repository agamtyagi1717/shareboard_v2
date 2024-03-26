"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Label } from "./ui/label";
import { io } from "socket.io-client";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Download, Upload } from "lucide-react";
// import { Blob } from "buffer";

const ShareInfo = () => {
  const [socket, setSocket] = useState<any>(undefined);
  const [inbox, setInbox] = useState<any>([]);
  const [message, setMessage] = useState({
    message: "",
    socketId: "",
    username: "",
  });
  const [otherRoomID, setOtherRoomID] = useState("");
  const [roomID, setRoomID] = useState("");
  const [socketID, setSocketID] = useState("");
  const [uploadedFile, setUploadedFile] = useState(null);
  const [receivedFile, setReceivedFile] = useState(null);
  const [username, setUsername] = useState("");

  const handleFileUpload = (e: any) => {
    e.preventDefault();

    if (uploadedFile) {
      socket.emit("uploadFile", uploadedFile[0], roomID);
    } else {
      console.log("No file uploaded.");
    }
    socket.emit(
      "message",
      roomID,
      {
        message: `${username} sent a file`,
        socketId: socket.id,
        username: "Admin",
      },
      username
    );
  };

  const handleDownload = (e: any) => {
    e.preventDefault();

    if (receivedFile) {
      socket.emit("downloadFile", receivedFile);

      socket.on("fileData", (fileData: any) => {
        console.log(fileData);

        const blob = new Blob([fileData.data]);
        const downloadLink = document.createElement("a");
        downloadLink.href = window.URL.createObjectURL(blob);
        downloadLink.download = fileData.fileName;
        downloadLink.click();

        document.removeChild(downloadLink);
      });
    }
  };

  const handleSendMessage = (e: any) => {
    e.preventDefault();
    socket.emit("message", roomID, message, username);
    e.target.reset();
  };

  const handleJoinRoom = (e: any) => {
    e.preventDefault();
    setRoomID(otherRoomID);
    setSocketID(socket.id);
    if (otherRoomID) {
      toast.success(`${username} joined Room ${otherRoomID}`, {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    } else {
      toast.error(`Enter a room ID`, {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }
    socket.emit(
      "message",
      otherRoomID,
      {
        message: `${username} joined room ${otherRoomID}`,
        socketId: socket.id,
        username: "Admin",
      },
      username
    );

    socket.emit("joinRoom", otherRoomID);
  };
  const handleLeaveRoom = (e: any) => {
    e.preventDefault();
    setRoomID("");
    setInbox([]);
    toast.info(`Left Room ${otherRoomID}`, {
      position: "top-right",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
    socket.emit("leaveRoom", roomID);

    socket.emit(
      "message",
      roomID,
      {
        message: `${username} left room ${roomID}`,
        socketId: socket.id,
        username: "Admin",
      },
      username
    );
  };

  useEffect(() => {
    // const socket = io("http://localhost:4000");
    const socket = io("https://shareboard-v2.onrender.com");

    socket.on("message", (message) => {
      setInbox((inbox: any) => [...inbox, message]);
    });

    socket.on("downloadFile", (receivedFile) => {
      console.log(receivedFile);
      setReceivedFile(receivedFile);
    });

    setSocket(socket);
  }, []);

  return (
    <div className="flex sm:flex-row flex-col justify-center items-center gap-7 w-full">
      <Card className="sm:w-[450px] relative w-[85%] pt-6">
        <CardContent>
          <form className="flex flex-col gap-7">
            <div>
              <div className="flex flex-col gap-4">
                <Label>What's your name?</Label>
                <Input
                  onChange={(e) => {
                    setUsername(e.target.value);
                  }}
                  placeholder="Enter your name"
                />
                <Label>Choose a unique room ID</Label>
                <Input
                  onChange={(e) => {
                    setOtherRoomID(e.target.value);
                  }}
                  placeholder="Enter Room ID"
                />
                <Button
                  type="submit"
                  onClick={(e) => {
                    handleJoinRoom(e);
                  }}
                  variant="green"
                  disabled={roomID ? true : false}
                >
                  Enter room
                </Button>
                <ToastContainer />
              </div>
            </div>

            <Card className="p-3">
              <Label>Send a file</Label>
              <div className="flex gap-3 mt-2">
                <Input
                  type="file"
                  onChange={(e: any) => setUploadedFile(e.target.files)}
                />
                <Button
                variant="outline"
                  onClick={handleFileUpload}
                  disabled={roomID && uploadedFile ? false : true}
                >
                  <Upload />
                </Button>
                <div>
                  {receivedFile ? (
                    <Button
                      onClick={(e: any) => {
                        handleDownload(e);
                      }}
                      variant="blue"
                    >
                      <Download />
                    </Button>
                  ) : null}
                </div>
              </div>
            </Card>
          </form>
        </CardContent>
      </Card>

      {roomID && (
        <Card className="sm:w-[450px] w-[85%] h-[500px] relative overflow-auto">
          <div className="border-b-[1px] flex justify-between items-center text-center p-2">
            <p className="text-xl">{roomID}</p>
            <Button
              type="submit"
              onClick={(e) => {
                handleLeaveRoom(e);
              }}
              variant="destructive"
            >
              Leave room
            </Button>
          </div>
          <CardContent className="h-[430px] overflow-auto">
            {inbox.map((messageInfo: any, index: number) => (
              <div key={index}>
                {messageInfo.username === "Admin" ? (
                  <div className="text-xs text-center">
                    {messageInfo.message}
                  </div>
                ) : (
                  <div
                    className={`flex flex-col py-2 ${
                      socketID === messageInfo.socketId
                        ? "items-end"
                        : "items-start"
                    }`}
                  >
                    {socketID === messageInfo.socketId ? (
                      <div className="text-end">
                        <p className="text-xs">{messageInfo.username}</p>
                        <div className="bg-cyan-400 rounded-tr-none rounded-md px-5 py-1 max-w-[300px]">
                          {messageInfo.message}
                        </div>
                      </div>
                    ) : (
                      <div className="text-start">
                        <p className="text-xs">{messageInfo.username}</p>
                        <div className="bg-gray-700 text-white rounded-tl-none rounded-md px-3 py-1 max-w-[300px]">
                          {messageInfo.message}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}

            <form
              onSubmit={(e) => {
                handleSendMessage(e);
              }}
              className="form1 flex gap-2 absolute bottom-5 left-2 right-2"
            >
              <Input
                onChange={(e) => {
                  setMessage({
                    message: e.target.value,
                    socketId: socket.id,
                    username: username,
                  });
                }}
                placeholder={`Send message in ${roomID}`}
              />
              <Button type="submit">Send</Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ShareInfo;

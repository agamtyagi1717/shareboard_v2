"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Label } from "./ui/label";
import { io } from "socket.io-client";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

const ShareInfo = () => {
  const [socket, setSocket] = useState<any>(undefined);
  const [inbox, setInbox] = useState<any>([]);
  const [message, setMessage] = useState({ message: "", socketId: "" });
  const [otherRoomID, setOtherRoomID] = useState("");
  const [roomID, setRoomID] = useState("");
  const [socketID, setSocketID] = useState("");

  const handleSendMessage = (e: any) => {
    e.preventDefault();
    socket.emit("message", roomID, message);
  };

  const handleJoinRoom = (e: any) => {
    e.preventDefault();
    setRoomID(otherRoomID);
    setSocketID(socket.id);

    socket.emit("joinRoom", otherRoomID);
  };
  const handleLeaveRoom = (e: any) => {
    e.preventDefault();
    setRoomID("");

    socket.on("disconnect");
  };

  useEffect(() => {
    const socket = io("http://localhost:4000");

    socket.on("message", (message) => {
      setInbox((inbox: any) => [...inbox, message]);
    });

    setSocket(socket);
  }, []);

  return (
    <div className="flex sm:flex-row flex-col justify-center items-center gap-7 w-full">
      <Card className="sm:w-[450px] relative w-[75%] pt-6">
        <CardContent>
          <form>
            <div>
              <div className="flex flex-col gap-2">
                <Label>Choose a unique room ID</Label>
                <Input
                  onChange={(e) => {
                    setOtherRoomID(e.target.value);
                  }}
                  placeholder="Enter Room ID"
                />
                <form className="flex w-full justify-center gap-2">
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
                  <Button
                    type="submit"
                    onClick={(e) => {
                      handleLeaveRoom(e);
                    }}
                    variant="destructive"
                    disabled={roomID ? false : true}
                  >
                    Leave room
                  </Button>
                </form>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      {roomID ? (
        <Card className="sm:w-[450px] w-[75%] h-[500px] relative overflow-auto">
          <CardContent className="h-[430px] overflow-auto">
            {inbox.map((pair: any, index: number) => (
              <div
                className={`flex flex-col py-2 ${
                  socketID == pair.socketId ? "items-end" : "items-start"
                }`}
              >
                {socketID == pair.socketId ? (
                  <div className="">
                    <div
                      className="bg-blue-400 rounded-md px-5 py-1 max-w-[300px] text-end"
                      key={index}
                    >
                      {pair.message}
                    </div>
                  </div>
                ) : (
                  <div className="">
                    <div
                      className="bg-gray-700 rounded-md px-3 py-1 max-w-[300px] text-start"
                      key={index}
                    >
                      {pair.message}
                    </div>
                  </div>
                )}
              </div>
            ))}

            <form className="flex gap-2 absolute bottom-5 left-2 right-2">
              <Input
                onChange={(e) => {
                  setMessage({ message: e.target.value, socketId: socket.id });
                }}
                placeholder="Start Typing..."
              />
              <Button
                onClick={(e) => {
                  handleSendMessage(e);
                }}
                type="submit"
              >
                Send
              </Button>
            </form>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
};

export default ShareInfo;

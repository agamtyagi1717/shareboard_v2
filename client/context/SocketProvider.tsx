// "use client";
// import { nanoid } from "nanoid";
// import React, {
//   createContext,
//   useContext,
//   useMemo,
//   useState,
// } from "react";
// import { io } from "socket.io-client";
// import { Socket } from "socket.io-client/debug";

// const SocketContext = createContext<any>({});

// export const useSocket = () => {
//   const socket: { socket: Socket; roomID: any} = useContext(SocketContext);
//   return socket;
// };

// export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
//   const socket = useMemo(() => {
    
//     return io("http://localhost:4000");
//   }, []);
//   const roomID = useMemo(()=>{
//     return nanoid(10);
//   },[]);
//   return (
//     <SocketContext.Provider value={{ socket, roomID }}>
//       {children}
//     </SocketContext.Provider>
//   );
// };
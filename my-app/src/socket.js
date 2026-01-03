import { io } from "socket.io-client";
 let liveServer = "https://realtime-chat-8mc17k0ok-jacky-yadavs-projects.vercel.app/"
// let localServer = "http://localhost:5000"
export const socket = io(liveServer, {
  withCredentials: true,
  autoConnect: true
});

import { io } from "socket.io-client";
//  let liveServer = "https://realtime-chat-8mc17k0ok-jacky-yadavs-projects.vercel.app/"
const SOCKET_URL = import.meta.env.VITE_API_BASE_URL.replace("/api", "");
// let localServer = "http://localhost:5000"
export const socket = io(SOCKET_URL, {
  withCredentials: true,
  autoConnect: true
});

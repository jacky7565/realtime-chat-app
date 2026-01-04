import express from "express";
import http from "http";
import userRoutes from "./routes/userRoutes.js";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { rateLimit } from "express-rate-limit";
import cors from "cors"
import cookieParser from "cookie-parser"
import { Server } from "socket.io";

dotenv.config();
let app = express();
let PORT = process.env.PORT || 4000;
app.use(express.json());
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('assets/uploads'));

let corsObj = {
  // origin: "http://localhost:5173",
  origin: process.env.FRONTEND_URL,


  methods: ["GET", "POST", "DELETE", "PUT"],
  credentials: true
}

app.use(cors(corsObj))

let apiRateLimiter = {
  windowMs: 1 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    message: "Too many requests, please try again later",
  },
};
const limiter = rateLimit(apiRateLimiter);
app.use(limiter);
app.use("/api", userRoutes);

const server = http.createServer(app);

const io = new Server(server, {
  cors: corsObj
});

let onlineUsers = new Map();

io.on("connection", (socket) => {
  // console.log("User connected:", socket.id);

  socket.on("addUser", (userId) => {
    onlineUsers.set(userId, socket.id);

    io.emit("getOnlineUsers", Array.from(onlineUsers.keys()));
  });


  socket.on("sendMessage", ({ senderId, receiverId, message }) => {
    const receiverSocketId = onlineUsers.get(receiverId)
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("receiveMessage", {
        senderId,
        message,
        createAt: new Date()
      })
    }

  })

  socket.on("startTyping",({senderId,receiverId})=>{
    const receiverSocketId=onlineUsers.get(receiverId)
    if(receiverSocketId){
      io.to(receiverSocketId).emit('startTyping',{senderId})
    }
  })
  socket.on("stopTyping",({senderId,receiverId})=>{
    const receiverSocketId=onlineUsers.get(receiverId)
    if(receiverSocketId){
      io.to(receiverSocketId).emit("stopTyping",{senderId})
    }
  })

  socket.on("disconnect", () => {
    for (let [userId, socketId] of onlineUsers) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
        break;
      }
    }

    io.emit("getOnlineUsers", Array.from(onlineUsers.keys()));
    console.log("User disconnected:", socket.id);
  });
});


mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

server.listen(PORT, () => {
  console.log(`Server running on port number ${PORT}`);
});

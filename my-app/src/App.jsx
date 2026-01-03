import { useState } from "react";

import TodoItem from "./components/TodoItem";
import Form from "./components/Form";
import UserList from "./components/UserList";
import Login from "./components/Login";
import ChatApp from "./components/chatComponent/ChatApp";
// import { io } from "socket.io-client";
import { Routes, Route, BrowserRouter } from "react-router-dom";

import { AuthProvider } from "./components/AuthContext";

function App() {  

  return (
    <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/"     element={<TodoItem />} />
        <Route path="/list" element={<UserList/>} />
         <Route path="/login" element={<Login/>} />
        <Route path="/form" element={<Form />} />
         <Route path="/chat" element={<ChatApp />} />
      </Routes>
    </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

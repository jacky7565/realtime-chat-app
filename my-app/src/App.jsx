import { useState } from "react";

import TodoItem from "./components/TodoItem";
import Form from "./components/Form";
import UserList from "./components/UserList";
import Login from "./components/Login";
import ChatApp from "./components/chatComponent/ChatApp";
// import { io } from "socket.io-client";
import { Routes, Route, BrowserRouter } from "react-router-dom";

import { AuthProvider } from "./components/AuthContext";

import ProtectedRouter from "./components/ProtectedRouter";

function App() {

  return (

    <Routes>
      <Route path="/" element={<ProtectedRouter><ChatApp /></ProtectedRouter>} />

      <Route path="/user" element={<UserList />} />
      <Route path="/todo" element={<TodoItem />} />
      <Route path="/login" element={<Login />} />
      <Route path="/form" element={<Form />} />
      <Route path="/chat" element={<ProtectedRouter><ChatApp /></ProtectedRouter>} />
    </Routes>

  );
}

export default App;

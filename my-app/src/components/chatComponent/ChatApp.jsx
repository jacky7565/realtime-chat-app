import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { ChatPageSkeleton } from "./ChatPageSkeleton";
import { userAuth } from "../AuthContext";
import { io } from "socket.io-client";
import { socket } from "../../socket";

export default function ChatApp() {

    const { userData } = userAuth();
    const loggedInUserId = userData?.id
    const USERAPI = import.meta.env.VITE_API_BASE_URL;
    let baseUrl = import.meta.env.VITE_BASE_URL;
    const [userList, setUserList] = useState([]);
    const [pageLoading, setPageLoading] = useState(true);
    const [activeUserId, setActiveUserId] = useState(null);
    const [sendMessage, setSendMessage] = useState("");
    const [conversation, setConversation] = useState([]);
    const [activeUserDetail, setActiveUserDetail] = useState({})
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [startTyping, setStartTyping] = useState(false);
    const typingTimeout = useRef(null);
    const chatContainerRef = useRef(null);
    const chatEndRef = useRef(null);


    useEffect(() => {
        socket.on("getOnlineUsers", (users) => {
            console.log("onlineUsers from socket:", users);
            setOnlineUsers(users);
        });

        return () => socket.off("getOnlineUsers");

    }, []);

    useEffect(() => {
        socket.on("receiveMessage", (data) => {
            setConversation((prev) => [...prev, data]);
        });

        return () => socket.off("receiveMessage");
    }, []);


    useEffect(() => {
        socket.on("startTyping", ({ senderId }) => {
            if (senderId == activeUserId) {
                setStartTyping(true)
            }
        });

        socket.on("stopTyping", ({ senderId }) => {
            if (senderId == activeUserId) {
                setStartTyping(false)
            }
        });

        return () => {
            socket.off("typing")
            socket.off("stopTyping");
        }

    }, [activeUserDetail])



    useEffect(() => {
        if (!loggedInUserId) return
        fetchUser()


    }, [loggedInUserId, activeUserDetail])


    useEffect(() => {
        if (loggedInUserId) {
            socket.emit("addUser", loggedInUserId);
        }
    }, [loggedInUserId]);



    async function fetchUser() {
        try {
            let fetchData = await axios.get(`${USERAPI}/fetch`, { withCredentials: true });
            if (!fetchData.data.success) {
                toast.error(fetchData.data.message)
                return
            }
            let userListData = fetchData.data.data.filter((val) => val._id !== loggedInUserId)
            setUserList(userListData)
            setPageLoading(false)
        }
        catch (error) {
            console.log(error)
        }
    }

    let selectUserHandlear = async (id) => {
        let receiverId = id
        if (!receiverId) return
        setActiveUserId(id)
        try {
            let fetchActiveUser = await axios.get(`${USERAPI}/fetch/${id}`, { withCredentials: true })
            let fetchConversation = await axios.get(`${USERAPI}/conversation-chat/${id}`, { withCredentials: true })

            if (fetchConversation.data.success) {
                setConversation(fetchConversation.data.data)
            }
            setActiveUserDetail(fetchActiveUser.data.data)


        } catch (erro) {
            console.log(erro)
        }
    }


    const handleSend = async () => {

        if (!activeUserId || !sendMessage) return

        socket.emit("sendMessage", {
            senderId: loggedInUserId,
            receiverId: activeUserId,
            message: sendMessage
        });

        try {
            let body = {
                receiverId: activeUserId,
                message: sendMessage
            };
            let conversation = await axios.post(`${USERAPI}/insert-chat`, body, { withCredentials: true })

            setSendMessage("")
            selectUserHandlear(activeUserId)

        }
        catch (error) {
            console.log(error)
        }

    }


    const handleTyping = (e) => {
        setSendMessage(e.target.value);
        socket.emit("startTyping", { senderId: loggedInUserId, receiverId: activeUserId })

        if (typingTimeout.current) {
            clearTimeout(typingTimeout.current);
        }

        typingTimeout.current = setTimeout(() => {
            socket.emit("stopTyping", {
                senderId: loggedInUserId,
                receiverId: activeUserId,
            });
        }, 500);
    };

    useEffect(() => {
        let currentDiv = chatContainerRef.current;
        if (!currentDiv) return
        let calculateScroll = currentDiv.scrollHeight - currentDiv.scrollTop - currentDiv.clientHeight < 120;
        if (calculateScroll) {
            chatEndRef.current.scrollIntoView({ behavior: "smooth" })
        }
    }, [conversation, activeUserId])

    useEffect(() => {
        if (!activeUserId) return;
        chatEndRef.current?.scrollIntoView({ behavior: "auto" });
    }, [conversation, activeUserId]);

    let hanleKeyDown = async (e) => {
        if (e.key == "Enter" && !e.shiftKey) {
            if (!activeUserId || !sendMessage) return

            socket.emit("sendMessage", {
                senderId: loggedInUserId,
                receiverId: activeUserId,
                message: sendMessage
            });

            try {
                let body = {
                    receiverId: activeUserId,
                    message: sendMessage
                };
                let conversation = await axios.post(`${USERAPI}/insert-chat`, body, { withCredentials: true })

                setSendMessage("")
                selectUserHandlear(activeUserId)

            }
            catch (error) {
                console.log(error)
            }
        }

    }

    return (
        <>
            {pageLoading ? (
                <ChatPageSkeleton />
            ) : (
                <div className="h-screen flex bg-slate-100">
                    {/* Sidebar */}
                    <aside className="w-80 bg-white border-r flex flex-col">
                        <div className="p-4 border-b text-lg font-semibold">My Chat</div>
                        <div className="flex-1 overflow-y-auto">
                            {userList.map((user, i) => {
                                const isOnline = onlineUsers?.includes(user._id);
                                return (
                                    <div
                                        onClick={() => selectUserHandlear(user._id)}
                                        key={user._id}
                                        className={`flex items-center gap-3 p-4 cursor-pointer hover:bg-slate-100 ${i === 0 && 'bg-slate-100'}`}
                                    >
                                        <div className="relative">
                                            <img
                                                src={`${baseUrl}uploads/${user.image}`}
                                                onError={(e) => (e.target.src = "/profile-default.png")}
                                                alt="avatar"
                                                className="w-10 h-10 rounded-full object-cover"
                                            />
                                            {
                                                isOnline && <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white"></span>}
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium">{user.name.charAt(0).toUpperCase()}{user.name.slice(1)}</p>
                                            <p className="text-sm text-gray-500 truncate">Last message preview...</p>
                                        </div>
                                    </div>
                                )
                            }
                            )}
                        </div>
                    </aside>

                    {/* Chat Area */}
                    {activeUserId && <main className="flex-1 flex flex-col">
                        {/* Header */}
                        <div className="p-4 bg-white border-b flex items-center gap-3">
                            <img src={`${baseUrl}uploads/${activeUserDetail.image}`} onError={(e) => (e.target.src = "/profile-default.png")} className=" w-10 h-10 rounded-full object-cover" />
                            <div>
                                <p className="font-semibold">
                                    {activeUserDetail?.name &&
                                        activeUserDetail.name.charAt(0).toUpperCase() +
                                        activeUserDetail.name.slice(1)
                                    }
                                </p><span className="text-sm text-green-500">{onlineUsers.includes(activeUserDetail._id) ? 'Online' : ''}</span>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 p-4 overflow-y-auto space-y-3" ref={chatContainerRef}>
                            {conversation.map((msg) => {
                                const isSender = msg.senderId === loggedInUserId

                                return (
                                    <div
                                        key={msg._id}
                                        className={`max-w-xs p-3 rounded-lg shadow 
                                                ${isSender
                                                ? "ml-auto bg-indigo-600 text-white"
                                                : "bg-white text-black"
                                            }`}
                                    >
                                        {msg.message}
                                    </div>
                                )
                            })}
                            <div ref={chatEndRef} />
                        </div>




                        {/* Typing */}
                        {startTyping && (<div className="px-4 text-sm text-gray-500">
                            {/* {activeUserDetail.name?.charAt(0).toUpperCase() + activeUserDetail.name?.slice(1)}  */}
                            Typing...</div>)}

                        {/* Input */}
                        <div className="p-4 bg-white border-t flex items-center gap-2">
                            <textarea
                                type="text"
                                placeholder="Type a message..."
                                name="message"
                                value={sendMessage}
                                onChange={handleTyping}
                                onKeyDown={hanleKeyDown}
                                className=" px-4 pt-5 focus:outline-none  w-full resize-none border rounded-full"
                            />
                            <button className="bg-indigo-600 text-white px-4 py-2 rounded-full" onClick={handleSend}>Send</button>
                        </div>
                    </main>
                    }
                </div>

            )}

        </>
    );
}

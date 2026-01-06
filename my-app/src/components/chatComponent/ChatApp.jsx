import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { ChatPageSkeleton } from "./ChatPageSkeleton";
import { userAuth } from "../AuthContext";
import { io } from "socket.io-client";
import { socket } from "../../socket";
import { ArrowLeft } from "lucide-react";

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
            // console.log("onlineUsers from socket:", users);
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

        sendMessageSubmit()

    }

    async function sendMessageSubmit() {
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
            sendMessageSubmit()
        }

    }

    return (
        <>
            {pageLoading ? (
                <ChatPageSkeleton />
            ) : (
                <div className="h-screen flex bg-slate-100 overflow-hidden">

                    {/* ================= SIDEBAR ================= */}
                    <aside
                        className={`
                        bg-white border-r flex flex-col
                        w-full md:w-80
                        ${activeUserId ? "hidden md:flex" : "flex"}
                        `}
                    >
                        <div className="p-4 border-b text-lg font-semibold">
                            My Chat
                        </div>

                        <div className="flex-1 overflow-y-auto">
                            {userList.map((user) => {
                                const isOnline = onlineUsers?.includes(user._id);

                                return (
                                    <div
                                        key={user._id}
                                        onClick={() => selectUserHandlear(user._id)}
                                        className="flex items-center gap-3 p-3 md:p-4 cursor-pointer hover:bg-slate-100"
                                    >
                                        <div className="relative">
                                            <img
                                                src={`${baseUrl}uploads/${user.image}`}
                                                onError={(e) => (e.target.src = "/profile-default.png")}
                                                className="w-10 h-10 rounded-full object-cover"
                                            />
                                            {isOnline && (
                                                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
                                            )}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium truncate">
                                                {user.name.charAt(0).toUpperCase() + user.name.slice(1)}
                                            </p>
                                            <p className="text-sm text-gray-500 truncate">
                                                Last message preview...
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </aside>

                    
                    {activeUserId && (
                        <main className="flex-1 flex flex-col bg-slate-100">

                            
                            <div className="p-3 md:p-4 bg-white border-b flex items-center gap-3">
                                <button
                                    onClick={() => setActiveUserId(null)}
                                    className="md:hidden text-xl text-gray-600"
                                >
                                    <ArrowLeft className="cursor-pointer w-6 h-6"/>
                                </button>

                                <img
                                    src={`${baseUrl}uploads/${activeUserDetail.image}`}
                                    onError={(e) => (e.target.src = "/profile-default.png")}
                                    className="w-10 h-10 rounded-full object-cover"
                                />

                                <div>
                                    <p className="font-semibold">
                                        {activeUserDetail?.name?.charAt(0).toUpperCase() +
                                            activeUserDetail?.name?.slice(1)}
                                    </p>
                                    <span className="text-xs text-green-500">
                                        {onlineUsers.includes(activeUserDetail._id) ? "Online" : ""}
                                    </span>
                                </div>
                            </div>

                          
                            <div
                                className="flex-1 p-3 md:p-4 overflow-y-auto space-y-3"
                                ref={chatContainerRef}
                            >
                                {conversation.map((msg) => {
                                    const isSender = msg.senderId === loggedInUserId;

                                    return (
                                        <div
                                            key={msg._id}
                                            className={`
                                            p-3 rounded-2xl shadow text-sm
                                            max-w-[85%] md:max-w-xs
                                            ${isSender
                                                    ? "ml-auto bg-indigo-600 text-white"
                                                    : "bg-white text-black"}
                                            `}
                                        >
                                            {msg.message}
                                        </div>
                                    );
                                })}
                                <div ref={chatEndRef} />
                            </div>

                           
                            {startTyping && (
                                <div className="px-4 text-sm text-gray-500">
                                    Typing...
                                </div>
                            )}

                           
                            <div className="p-2 md:p-4 bg-white border-t flex items-end gap-2">
                                <textarea
                                    placeholder="Type a message..."
                                    value={sendMessage}
                                    onChange={handleTyping}
                                    onKeyDown={hanleKeyDown}
                                    rows={1}
                                    className="flex-1
                                            px-4 py-3
                                            resize-none
                                            border
                                            rounded-2xl
                                            focus:outline-none
                                            text-sm
                                            max-h-32
                                            overflow-y-auto" />

                                <button
                                    onClick={handleSend}
                                    className="bg-indigo-600 text-white px-4 py-2 rounded-full"
                                >
                                    Send
                                </button>
                            </div>

                        </main>
                    )}
                </div>


            )}

        </>
    );
}

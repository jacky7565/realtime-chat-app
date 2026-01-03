import Message from "../models/userMessageModel.js";
export const insertChat = async (req, res) => {
    try {
        const { receiverId, message } = req.body;
        console.log(req.body)
        const senderId=req.user.id;
        if (!receiverId || !message) {
            return res.status(400).json({ success: false, message: "Receiver and message required" });
        }

        let insertChat = await Message.create({
            receiverId: receiverId,
            senderId: senderId,
            message: message
        })
        return res.status(200).json({ success: true, data: insertChat, message: "Message sent successfully" })
    }
    catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }

}
 
export const getConversation = async (req, res) => {
    try {

        const senderId = req.user.id;
        let receiverId = req.params.userId

        if (!receiverId) {
            return res.status(400).json({ success: false, message: "reciverId required" });
        }

        let chatData = await Message.find({
            $or: [
                { senderId: senderId, receiverId: receiverId },
                { senderId: receiverId, receiverId: senderId }
            ]
        }).sort({ createdAt: 1 })
        return res.status(200).json({ success: true, data: chatData, message: "Message recived successfully" })
    }
    catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }

}
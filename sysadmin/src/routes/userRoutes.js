import express from "express";
import multer from "multer";
import {getUsers,create,deleteUser,updateUser,currentUser} from "../controllers/userController.js"
import {login} from "../controllers/authController.js ";
import {insertChat,getConversation} from "../controllers/chatController.js"
import auth from "../middleware/auth.js";
import fs from 'fs';
const uploadPath="./assets/uploads"
if(!fs.existsSync(uploadPath)){
    fs.mkdirSync(uploadPath)
}
const router = express.Router();
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadPath),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});

const upload = multer({ storage });

router.get("/",auth,getUsers)
router.post("/create", upload.single("image"),create)
router.get("/fetch",auth,getUsers)
router.get("/fetch/:id",auth,getUsers)
router.delete("/delete/:id",auth,deleteUser)
router.put("/update/:id",auth,updateUser)
router.post("/login",login)
router.post('/insert-chat',auth,insertChat)
router.get('/conversation-chat/:userId',auth,getConversation)
router.get('/current-user',auth,currentUser)

export default router




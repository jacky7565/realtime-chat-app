import User from "../models/userModel.js";
import jsonwebtoken from "jsonwebtoken";
import { comparePassword } from "./common.js";

export const login = async (req, res) => {
  try {
    let { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and Password are required" });
    }
    let checkUser = await User.findOne({ email });
    let checkPassword = await comparePassword(password, checkUser.password);
    if (!checkUser || !checkPassword) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid Credentials" });
    }
    if (checkUser.status !== "active") {
      return res
        .status(403)
        .json({ success: false, message: "User inactive. Access denied." });
    }
    let tokenSecret = process.env.TOKEN_SECRET;
    let payload = { id: checkUser._id,name:checkUser.name,image:checkUser.image , email: checkUser.email };
    let token = jsonwebtoken.sign(payload, tokenSecret, { expiresIn: "1h" });

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      maxAge: 24 * 60 * 60 * 1000,
    });
    return res
      .status(200)
      .json({ success: true, message: "Login successful", token });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};

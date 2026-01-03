import User from "../models/userModel.js";
import { hasPassword } from "./common.js";

export const getUsers = async (req, res) => {
  try {
    let userId = req.params.id;
    let users;
    if (userId) {
      users = await User.findById(userId).select('-password');
    } else {
      users = await User.find().select('-password');
    }
    if (users.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No users found!" });
    }
    return res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      data: users,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};

export const create = async (req, res) => {
  const { name, email, phone, password } = req.body;

  const profileImage = req.file.filename || null;

  if (!name || !email || !phone || !password) {
    return res.status(400).json({
      message: "All fields are required",
      fields: ["name", "email", "phone", "password"],
    });
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid email format." });
  }

  try {

    let passwordHas = await hasPassword(password);
    let InsertData={
      name:name,
      email:email,
      phone:phone,
      password:passwordHas,
      image:profileImage
    }
    let createData = await User.create(InsertData);
    return res.status(201).json({
      success: true,
      message: "User created successfully",
      data: createData,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    let userId = req.params.id;
    if (!userId)
      return res
        .status(400)
        .json({ success: false, message: "User ID is required " });
    let deleteUser = await User.findByIdAndDelete(userId);
    if (!deleteUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found!" });
    }
    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
      data: deleteUser,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    let userId = req.params.id;
    if (!userId)
      return res
        .status(400)
        .json({ success: false, message: "User ID is required " });
    let updateId = await User.findById(userId);
    if (!updateId)
      return res
        .status(404)
        .json({ success: false, message: "User not found!" });
    let updateData = await User.findByIdAndUpdate(userId, req.body, {
      new: true,
    });
    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: updateData,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};

export const currentUser=async (req,res)=>{
try{
 let userData=await req.user
 return res.status(200).json({ success: true, message: "User data fetch successfully", data:userData })
 
}
catch(error){
  return res.status(500).json({ success: false, message: "Server Error", error: error.message })
}
}
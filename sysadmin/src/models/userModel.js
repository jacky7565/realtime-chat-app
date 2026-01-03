import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50,
    // uppercase: true,
  },
  email: {
    type: String,
    required: true,
    maxlength: 100,
    trim: true,
    unique: true,
  },
  password: { type: String, required: true, maxlength: 100 },
  phone: { type: String, required: true, maxlength: 15, trim: true },
  image: { type: String, default: null },
  status: { type: String, enum: ["active", "inactive"], default: "active" },
  createdAt: { type: Date, default: Date.now },
  updateAt: { type: Date, default: Date.now },
});
export default mongoose.model("User", userSchema);

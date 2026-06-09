import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema(
  {
    sender: { type: String, required: true },  // username
    content: { type: String, required: true },
    avatar: { type: String, default: "" },
  },
  { timestamps: true }
);
export default mongoose.model("Message", MessageSchema);
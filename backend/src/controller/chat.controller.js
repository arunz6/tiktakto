import Message from "../module/chat.module.js";

// Save Message
export const sendMessage = async (req, res) => {
  try {
    const { sender, content, avatar } = req.body;

    if (!sender || !content) {
      return res.status(400).json({
        success: false,
        message: "Sender and content are required",
      });
    }

    const newMessage = await Message.create({
      sender,
      content,
      avatar,
    });

    res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: newMessage,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Messages
export const getMessages = async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      data: messages,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

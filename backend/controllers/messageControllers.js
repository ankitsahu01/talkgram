const ErrorHandler = require("../config/errorHandler");
const asyncErrorHandler = require("../config/asyncErrorHandler");
const Message = require("../models/messageModel");
const User = require("../models/userModel");
const Chat = require("../models/chatModel");

const sendMessage = asyncErrorHandler(async (req, res, next) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    return next(new ErrorHandler("Missing required field(s)", 400));
  }
  const newMessage = {
    sender: req.user._id,
    content,
    chat: chatId,
  };
  try {
    var message = await Message.create(newMessage);
    message = await message.populate("sender", "fullname username email pic");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "fullname username email pic",
    });
    await Chat.findByIdAndUpdate(chatId, { latestMessage: message._id });
    res.status(200).json(message);
  } catch (err) {
    console.log(err.message);
    next(new ErrorHandler(err.message, 400));
  }
});

const fetchMessages = asyncErrorHandler(async (req, res, next) => {
  try {
    const { chatId } = req.params;
    const allMessages = await Message.find({ chat: chatId })
      .populate("sender", "fullname username email pic")
      .populate("chat");
    if (allMessages) return res.status(200).json(allMessages);
    next(new ErrorHandler("No messaages found!", 404));
  } catch (err) {
    console.log(err.message);
    next(new ErrorHandler("Invalid chat id", 400));
  }
});

module.exports = { sendMessage, fetchMessages };

const Chat = require("../models/chatModel");
const User = require("../models/userModel");
const asyncErrorHandler = require("../config/asyncErrorHandler");
const ErrorHandler = require("../config/errorHandler");

const accessChat = asyncErrorHandler(async (req, res, next) => {
  const { userId } = req.body;
  console.log(userId);
  if (!userId) {
    console.log("userId param not sent with the request");
    return next(
      new ErrorHandler("userId param not sent with the request", 400)
    );
  }

  var isChat = await Chat.findOne({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "fullname username email pic",
  });

  if (isChat) {
    res.status(200).json(isChat);
  } else {
    try {
      const createdChat = await Chat.create({
        chatName: "sender",
        isGroupChat: false,
        users: [req.user._id, userId],
      });
      const FullChat = await Chat.findById(createdChat._id).populate(
        "users",
        "-password"
      );
      res.status(200).json(FullChat);
    } catch (err) {
      new ErrorHandler(err.message, 400);
    }
  }
});

const fetchChats = asyncErrorHandler(async (req, res, next) => {
  let allChats = await Chat.find({
    users: { $elemMatch: { $eq: req.user._id } },
  })
    .populate("users", "-msgNotifications -password")
    .populate("groupAdmin", "-msgNotifications -password")
    .populate("latestMessage")
    .sort({ updatedAt: -1 });

  allChats = await User.populate(allChats, {
    path: "latestMessage.sender",
    select: "fullname username email pic",
  });

  res.status(200).json(allChats);
});

const createGroup = asyncErrorHandler(async (req, res, next) => {
  if (!req.body.groupName || !req.body.users) {
    return next(new ErrorHandler("Required all field(s)!", 400));
  }
  let users = req.body.users;
  if (typeof users === "string") users = JSON.parse(req.body.users);
  if (users.length < 2) {
    return next(
      new ErrorHandler("More than 1 users are required to create a group!", 400)
    );
  }
  users.push(req.user);
  const groupChat = await Chat.create({
    chatName: req.body.groupName,
    isGroupChat: true,
    users,
    groupAdmin: req.user,
  });
  const retrieveChat = await Chat.findById(groupChat._id)
    .populate("users", "-password")
    .populate("groupAdmin", "-password");
  res.status(201).json(retrieveChat);
});

const renameGroup = asyncErrorHandler(async (req, res, next) => {
  const { groupChatId, groupNewName } = req.body;
  if (!groupChatId || !groupNewName) {
    return next(new ErrorHandler("Required all field(s)!", 400));
  }

  const updatedChat = await Chat.findByIdAndUpdate(
    groupChatId,
    {
      chatName: groupNewName,
    },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!updatedChat) {
    return next(new ErrorHandler("Group not found!", 404));
  }
  res.status(200).json(updatedChat);
});

const addUserToGroup = asyncErrorHandler(async (req, res, next) => {
  const { groupChatId, userId } = req.body;
  if (!groupChatId || !userId) {
    return next(new ErrorHandler("Required all field(s)!", 400));
  }

  const added = await Chat.findOneAndUpdate(
    { _id: groupChatId, groupAdmin: req.user._id },
    {
      $push: { users: userId },
    },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!added) {
    const isGrpExists = await Chat.findById(groupChatId).count();
    if (!isGrpExists) return next(new ErrorHandler("Group not found!", 404));
    return next(new ErrorHandler("You aren't admin!", 401));
  }
  res.status(200).json(added);
});

const removeUserFromGroup = asyncErrorHandler(async (req, res, next) => {
  const { groupChatId, userId } = req.body;
  if (!groupChatId || !userId) {
    return next(new ErrorHandler("Required all field(s)!", 400));
  }
  let query = { _id: groupChatId, groupAdmin: req.user._id };
  if (userId === req.user._id.toString()) {
    // When user remove ourself from group OR left the group.
    query = { _id: groupChatId };
  }

  const removed = await Chat.findOneAndUpdate(
    query,
    {
      $pull: { users: userId },
    },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!removed) {
    const isGrpExists = await Chat.findById(groupChatId).count();
    if (!isGrpExists) return next(new ErrorHandler("Group not found!", 404));
    return next(new ErrorHandler("You aren't admin!", 401));
  }
  res.status(200).json(removed);
});

const deleteGroup = asyncErrorHandler(async (req, res, next) => {
  const { groupChatId } = req.body;
  if (!groupChatId) {
    return next(new ErrorHandler("Required all field!", 400));
  }

  const deleted = await Chat.findOneAndDelete({
    _id: groupChatId,
    groupAdmin: req.user._id,
  });
  if (!deleted) {
    const isGrpExists = await Chat.findById(groupChatId).count();
    if (!isGrpExists) return next(new ErrorHandler("Group not found!", 404));
    return next(new ErrorHandler("You aren't admin!", 401));
  }
  res
    .status(200)
    .json({ success: true, message: "Group successfully deleted" });
});

module.exports = {
  accessChat,
  fetchChats,
  createGroup,
  renameGroup,
  addUserToGroup,
  removeUserFromGroup,
  deleteGroup,
};

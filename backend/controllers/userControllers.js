const ErrorHandler = require("../config/errorHandler");
const asyncErrorHandler = require("../config/asyncErrorHandler");
const generateToken = require("../config/generateToken");
const User = require("../models/userModel");
const Chat = require("../models/chatModel");

const registerUser = asyncErrorHandler(async (req, res, next) => {
  const { fullname, username, email, password, pic } = req.body;
  if (!fullname || !username || !email || !password) {
    return next(new ErrorHandler("Missing Required field(s)", 400));
  }
  if (password.length <= 5) {
    return next(new ErrorHandler("Password should more than 5 characters"));
  }
  const userExists = await User.find({ $or: [{ username }, { email }] });
  if (userExists.length !== 0)
    return next(new ErrorHandler("User already exists", 400));

  const user = await User.create({ fullname, username, email, password, pic });
  if (user) {
    res.status(201).json({
      success: true,
      _id: user._id,
      fullname: user.fullname,
      username: user.username,
      email: user.email,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    return next(new ErrorHandler("Unable to register user", 400));
  }
});

const loginUser = asyncErrorHandler(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorHandler("Missing Required field(s)", 400));
  }
  const user = await User.findOne({ email });
  if (user && user.matchPassword(password)) {
    res.status(200).json({
      success: true,
      _id: user._id,
      fullname: user.fullname,
      username: user.username,
      email: user.email,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    return next(new ErrorHandler("User not found", 404));
  }
});

const resetPassword = asyncErrorHandler(async (req, res, next) => {
  //this request will come from Forgot Password page / (without login).
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorHandler("Missing Required field(s)", 400));
  }
  const user = await User.findOne({ email });
  if (!user) return next(new ErrorHandler("User not found", 404));

  const isUpdated = await User.findOneAndUpdate(
    { email },
    { password },
    { new: true }
  );
  res.status(200);
  if (isUpdated) res.json({ success: true });
  else res.json({ success: false });
});

const changePassword = asyncErrorHandler(async (req, res, next) => {
  //this request will come from Profile page / (after login).
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    return next(new ErrorHandler("Missing Required field(s)", 400));
  }
  const user = await User.findById(req.user._id);
  if (!user) return next(new ErrorHandler("User not found", 404));
  if (!user.matchPassword(oldPassword))
    return next(new ErrorHandler("You entered incorrect old password.", 404));

  const isUpdated = await User.findOneAndUpdate(
    { _id: req.user._id },
    { password: newPassword },
    { new: true }
  );
  res.status(200);
  if (isUpdated) res.json({ success: true });
  else res.json({ success: false });
});

const searchAvailableUsername = asyncErrorHandler(async (req, res, next) => {
  const { q } = req.query;
  if (!q) {
    return next(new ErrorHandler("Missing Query String", 400));
  }
  const user = await User.findOne({ username: q });
  res.status(200);
  if (user) res.json({ success: false, message: "Username already taken!" });
  else res.json({ success: true, message: "Username available" });
});

const isEmailExist = asyncErrorHandler(async (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    return next(new ErrorHandler("Email field is required", 400));
  }
  const user = await User.findOne({ email });
  res.status(200);
  if (user) res.json({ success: true });
  else res.json({ success: false });
});

const searchUsers = asyncErrorHandler(async (req, res, next) => {
  const search = req.query.search;
  if (!search) {
    return next(new ErrorHandler("Missing search query", 400));
  }
  const query = search
    ? {
        $or: [
          { fullname: { $regex: search, $options: "i" } },
          { username: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ],
      }
    : {};

  const allUsers = await User.find(query, { password: 0 }).find({
    _id: { $ne: req.user._id },
  });
  res.json(allUsers);
});

const insertNotification = asyncErrorHandler(async (req, res, next) => {
  const { type, messageId } = req.body;
  if (!type || !messageId)
    return next(new ErrorHandler("Missing Required field(s)", 400));
  if (type === "message") {
    await User.findByIdAndUpdate(req.user._id, {
      $push: { msgNotifications: messageId },
    });
    res.status(200).json({ status: "Notification successfully inserted." });
  }
});

const fetchNotifications = asyncErrorHandler(async (req, res, next) => {
  var notifications = await User.findById(req.user._id, {
    msgNotifications: 1,
    _id: 0,
  }).populate("msgNotifications");

  notifications = await User.populate(notifications, {
    path: "msgNotifications.sender",
    select: "-msgNotifications -password",
  });
  notifications = await Chat.populate(notifications, {
    path: "msgNotifications.chat",
  });
  notifications = await notifications.populate(
    "msgNotifications.chat.users",
    "-msgNotifications -password"
  );
  notifications = await notifications.populate(
    "msgNotifications.chat.groupAdmin",
    "-msgNotifications -password"
  );
  res.status(200).json(notifications.msgNotifications);
});

const removeNotification = asyncErrorHandler(async (req, res, next) => {
  const { type, messageId } = req.body;
  if (!type || !messageId)
    return next(new ErrorHandler("Missing Required field(s)", 400));
  if (type === "message") {
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { msgNotifications: messageId },
    });
  }
  res.status(200).json({ status: "Notification successfully removed." });
});

module.exports = {
  registerUser,
  loginUser,
  searchAvailableUsername,
  searchUsers,
  insertNotification,
  fetchNotifications,
  removeNotification,
  isEmailExist,
  resetPassword,
  changePassword,
};

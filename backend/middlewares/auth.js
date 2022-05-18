const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const ErrorHandler = require("../config/errorHandler");

const auth = async (req, res, next) => {
  try {
    const authorization = req.headers.authorization;
    if (!authorization && !authorization.startsWith("Bearer")) {
      return next(new ErrorHandler("Unauthorized, no token!", 401));
    }
    const token = authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id, { password: 0 });
    if (!req.user) throw new Error("User not found from JWT");
    next();
  } catch (err) {
    console.log(err.message);
    return next(new ErrorHandler("Unauthorized, Invalid token!", 401));
  }
};

module.exports = auth;

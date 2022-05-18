const errorMiddleware = (err, req, res, next) => {
  if (!err.statusCode) console.log(err.stack);

  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal server error";

  res.status(err.statusCode).json({ success: false, message: err.message });
};

module.exports = errorMiddleware;

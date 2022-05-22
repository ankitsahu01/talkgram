const express = require("express");
const helmet = require("helmet");
const compression = require("compression");
require("dotenv").config();
require("./config/db")();
const {
  getGoogleAuthURL,
  getGoogleUser,
} = require("./controllers/googleOAuth");
const path = require("path");

const app = express();
app.use(express.json());
app.use(helmet());
app.use(compression());

//Getting Google Login URL
app.get("/auth/google/url", (req, res) => {
  return res.redirect(getGoogleAuthURL());
});
// After login get google profile
app.get("/auth/google", getGoogleUser);

// Check user jwt token
const auth = require("./middlewares/auth");
app.get("/auth/me", auth, (req, res) =>
  res.status(200).json({ message: "Authentic" })
);

//Import user route
const userRoutes = require("./routes/userRoutes");
app.use("/api/user", userRoutes);

//Import chat route
const chatRoutes = require("./routes/chatRoutes");
app.use("/api/chat", chatRoutes);

//Import message route
const messageRoutes = require("./routes/messageRoutes");
app.use("/api/message", messageRoutes);

// Import mailer route
const mailerRoutes = require("./routes/mailerRoutes");
app.use("/api/mailer", mailerRoutes);

// -------------------------------Deployment------------------------------
var forceSsl = function (req, res, next) {
  if (req.headers["x-forwarded-proto"] !== "https") {
    return res.redirect(["https://", req.get("Host"), req.url].join(""));
  }
  return next();
};
if (process.env.NODE_ENV === "production") {
  app.use(forceSsl);
  app.use(express.static(path.resolve(__dirname, "../", "frontend", "build")));
  app.get("/*", (req, res) => {
    res.sendFile(
      path.resolve(__dirname, "../", "frontend", "build", "index.html")
    );
  });
} else {
  app.get("/", (req, res) => {
    res.send("API is working");
  });
}
// -------------------------------Deployment------------------------------

//Middleware for Not Found API
const notFoundError = require("./middlewares/notFoundError");
app.use(notFoundError);

//Middleware for Errors
const errorMiddleware = require("./middlewares/error");
const res = require("express/lib/response");
app.use(errorMiddleware);

const PORT = process.env.PORT || 4000;
const server = app.listen(PORT, console.log(`Server is running on ${PORT}`));

require("./socketConnection")(server);

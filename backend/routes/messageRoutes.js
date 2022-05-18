const express = require("express");
const auth = require("../middlewares/auth");
const router = express.Router();
const {
  sendMessage,
  fetchMessages,
} = require("../controllers/messageControllers");

router.post("/", auth, sendMessage);
router.get("/:chatId", auth, fetchMessages);

module.exports = router;

const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const {
  accessChat,
  fetchChats,
  createGroup,
  deleteGroup,
  renameGroup,
  addUserToGroup,
  removeUserFromGroup,
} = require("../controllers/chatControllers");

router.route("/").post(auth, accessChat).get(auth, fetchChats);
router.route("/group/create").post(auth, createGroup);
router.route("/group/rename").put(auth, renameGroup);
router.route("/group/delete").delete(auth, deleteGroup);
router.route("/group/addUser").put(auth, addUserToGroup);
router.route("/group/removeUser").put(auth, removeUserFromGroup);

module.exports = router;

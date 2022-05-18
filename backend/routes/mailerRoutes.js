const express = require("express");
const router = express.Router();

const { sendOtp, validateOtp } = require("../controllers/mailerControllers");

router.post("/send-otp", sendOtp);
router.post("/validate-otp", validateOtp);

module.exports = router;

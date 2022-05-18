const ErrorHandler = require("../config/errorHandler");
const asyncErrorHandler = require("../config/asyncErrorHandler");
const mailer = require("nodemailer");
const OtpModel = require("../models/otpModel");

const transporter = mailer.createTransport({
  service: "gmail",
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});
const sendMail = async (body) => {
  try {
    await transporter.sendMail(body);
    return true;
  } catch (err) {
    console.log(err.message);
    return false;
  }
};

const sendOtp = asyncErrorHandler(async (req, res, next) => {
  const { email, otpSubject } = req.body;
  if (!email) return next(new ErrorHandler("Missing required field [email]"));
  const otp = Math.floor(1000 + Math.random() * 9000).toString();
  let body = {
    from: '"TalkGram" talkgrambyankit@gmail.com',
    to: email,
    subject: otpSubject || "A one time password - by TalkGram",
    html: `<h3>${otp} is your TalkGram OTP.</h3>`,
  };

  const isSent = await sendMail(body);

  await OtpModel.findOneAndUpdate(
    { email },
    { otp },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  res.status(200);
  if (isSent) res.json({ success: true, message: "Otp sent" });
  else res.json({ success: false, message: "Otp not sent" });
});

const validateOtp = asyncErrorHandler(async (req, res, next) => {
  const { email, enteredOtp } = req.body;
  if (!email || !enteredOtp)
    return next(new ErrorHandler("Missing required field(s)"));

  const otpDoc = await OtpModel.findOne({ email });
  res.status(200);
  if (otpDoc && otpDoc.matchOtp(enteredOtp.toString())) {
    await OtpModel.deleteOne({ email });
    res.json({ success: true, message: "Valid otp" });
  } else res.json({ success: false, message: "Invalid otp" });
});

module.exports = { sendOtp, validateOtp };

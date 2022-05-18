const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const otpSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    otp: {
      type: String,
      required: [true, "Otp is required"],
    },
  },
  { timestamps: true }
);

otpSchema.pre("findOneAndUpdate", function (next) {
  const salt = bcrypt.genSaltSync(10);
  this._update.otp = bcrypt.hashSync(this._update.otp, salt);
  next();
});

otpSchema.methods.matchOtp = function (enteredOtp) {
  return bcrypt.compareSync(enteredOtp, this.otp);
};

const OtpModel = mongoose.model("otp", otpSchema);

module.exports = OtpModel;

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = mongoose.Schema(
  {
    googleId: String,
    fullname: { type: String, required: [true, "name is required"] },
    username: {
      type: String,
      required: [true, "username is required"],
      unique: true,
    },
    email: {
      type: String,
      required: [true, "email is required"],
      unique: true,
    },
    password: { type: String, required: [true, "password is required"] },
    pic: String,
    msgNotifications: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Message" },
    ],
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", function (next) {
  if (this.isModified("password")) {
    const salt = bcrypt.genSaltSync(10);
    this.password = bcrypt.hashSync(this.password, salt);
  }
  next();
});

userSchema.pre("findOneAndUpdate", function (next) {
  if (this._update.password) {
    const salt = bcrypt.genSaltSync(10);
    this._update.password = bcrypt.hashSync(this._update.password, salt);
  }
  next();
});

userSchema.methods.matchPassword = function (enteredPassword) {
  return bcrypt.compareSync(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;

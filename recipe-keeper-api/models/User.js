const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  roles: {
    type: [String],
    default: ["Standard"],
  },
  active: {
    type: Boolean,
    default: true,
  },
  otpHash: { type: String },
  otpExpiresAt: { type: Date },
  otpAttempts: { type: Number, default: 0 },
});

module.exports = mongoose.model("User", userSchema);

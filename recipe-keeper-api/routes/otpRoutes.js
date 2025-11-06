const express = require("express");
const router = express.Router();
const {
  requestPasscode,
  verifyPasscode,
} = require("../controllers/otpController");

router.post("/request-passcode", requestPasscode);
router.post("/verify-passcode", verifyPasscode);

module.exports = router;

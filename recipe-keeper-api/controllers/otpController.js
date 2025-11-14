const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const nodemailer = require("nodemailer");
const { userInfo } = require("os");

async function sendSms(to, body) {
  console.log("📲 [DEV] SMS ->", to, body);
}

const CARRIER_TO_DOMAIN = {
  att: "txt.att.net",
  verizon: "vtext.com",
  tmobile: "tmomail.net",
  metropcs: "mymetropcs.com",
  boost: "myboostmobile.com",
  uscellular: "email.uscc.net",
  googlefi: "msg.fi.google.com",
  cricket: "sms.cricketwireless.net",
};

function normalizePhoneToDigits(p) {
  return (p || "").replace(/\D/g, "");
}

function maskPhone(p) {
  //   if (!p) return "";
  //   const s = p.replace(/\D/g, "");
  const s = normalizePhoneToDigits(p);
  const tail = s.slice(-4);
  return `(***) ***-${tail}`;
}

async function sendSmsViaEmail(phoneDigits, carrierKey, message) {
  const domain = CARRIER_TO_DOMAIN[carrierKey];
  if (!domain) throw new Error("Unsupported Carrier");

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT || 465),
    secure: (process.env.SMTP_SECURE || "true") !== "false",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const to = `${phoneDigits}@${domain}`;
  await transporter.sendMail({
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to,
    subject: "",
    text: message,
  });

  return { to, domain };
}

exports.requestPasscode = async (req, res) => {
  const { phone, carrier } = req.body;
  if (!phone || !carrier)
    return res.status(400).json({ message: "Phone and carrier are Required" });

  const phoneDigits = normalizePhoneToDigits(phone);
  if (phoneDigits.length < 10) {
    return res.status(400).json({ message: "Invalid phone number" });
  }

  const user = await User.findOne({ phone }).exec();
  if (!user)
    return res.status(404).json({ message: "No account with that phone" });

  // Generate code
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Hash, Expiration, and Attempt count
  const otpHash = await bcrypt.hash(otp, 10);
  user.otpHash = otpHash;
  user.otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 mins
  user.otpAttempts = 0;
  await user.save();

  const sms = `Here is a one-time passcode for account ${user.username}: ${otp}`;

  try {
    await sendSmsViaEmail(phoneDigits, carrier, sms);
  } catch (e) {
    console.error("Email->SMS failed: ", e);
    return res.status(502).json({
      message:
        "Could not send SMS via carrier gateway. Try a different carrier or try again later.",
    });
  }

  //   await sendSms(user.phone, sms);

  res.json({
    otpUserId: user._id.toString(),
    maskedPhone: maskPhone(user.phone),
    username: user.username,
  });
};

exports.verifyPasscode = async (req, res) => {
  const { otpUserId, code } = req.body;
  if (!otpUserId || !code)
    return res.status(400).json({ message: "Missing fields" });

  const user = await User.findById(otpUserId).exec();
  if (!user || !user.otpHash || !user.otpExpiresAt) {
    return res.status(400).json({ message: "Invalid or expired request" });
  }
  if (new Date() > user.otpExpiresAt) {
    return res.status(401).json({ message: "Code Expired" });
  }
  if ((user.otpAttempts || 0) >= 5) {
    return res.status(429).json({ message: "Too many attempts" });
  }

  const codeVerified = await bcrypt.compare(code, user.otpHash);
  user.otpAttempts = (user.otpAttempts || 0) + 1;

  if (!codeVerified) {
    await user.save();
    return res.status(401).json({ message: "Incorrect code" });
  }

  // Clear OTP fields
  user.otpHash = undefined;
  user.otpExpiresAt = undefined;
  user.otpAttempts = undefined;
  await user.save();

  // Issue access token like normal login
  const accessToken = jwt.sign(
    {
      UserInfo: {
        id: user._id.toString(),
        username: user.username,
        roles: user.roles,
      },
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  );

  res.json({ accessToken });
};

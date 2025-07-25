const jwt = require("jsonwebtoken");

const verifyJWT = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized verifyJWT" });
    }

    // console.log(process.env.ACCESS_TOKEN_SECRET);
    const token = authHeader.split(" ")[1];

    const decoded = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    req.user = decoded.UserInfo.username;
    req.phone = decoded.UserInfo.phone;
    req.roles = decoded.UserInfo.roles;

    next();
  } catch (err) {
    console.error("Token Verification failed:", err.message);

    if (err.name === "TokenExpiredError") {
      return res.status(403).json({ message: "Token expired" });
    } else if (err.name === "JsonWebTokenError") {
      return res.status(403).json({ message: "Invalid token" });
    }

    return res.status(403).json({ message: "Forbidden" });
  }
};

module.exports = verifyJWT;

// eyJBQ0NFU1NfVE9LRU5fU0VDUkVUIjoiZjhlMjllNWUwNzgwNGQ4MzIzZDUzNDg0YWNkZjJmZjkxZjE1NTg3MGVhMTViYTU4NGVhYjFhYjE4Mzg0YjI1ZGU2MTkzYWVkMWViMDFhMWRhNWUzNzJhNWU1MWNmZjZiYjQ3MTllMjYyM2MwZGEwMTM5ZjA4MzMxZTdlYjU0YTkifQ

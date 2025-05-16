const express = require("express");
const router = express.Router();
const path = require("path");

// Express 5 no longer allows regex-style
// i.e."^/$|/index(.html)?"
//Express 5 no longer allows the wildcard(*) to be empty it must now have a splat attach to it (*splat)
router.get(["/*splat", "/*index", "/{*index.html}"], (req, res) => {
  res.sendFile(path.join(__dirname, "..", "views", "index.html"));
});

module.exports = router;

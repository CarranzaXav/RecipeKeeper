const express = require("express");
const router = express.Router();
const { scrapeRecipe } = require("../controllers/scrapeController");

router.post("/", scrapeRecipe);

module.exports = router;

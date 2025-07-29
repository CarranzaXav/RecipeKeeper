const express = require("express");
const router = express.Router();
const recipesController = require("../controllers/recipesController");
const verifyJWT = require("../middleware/verifyJWT");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });

// router.get("/", recipesController.getAllRecipes);

router
  .route("/")
  .get(recipesController.getAllRecipes)
  .post(
    verifyJWT,
    upload.fields([{ name: "photo", maxCount: 10 }]),
    recipesController.createNewRecipe
  )
  .patch(
    verifyJWT,
    upload.fields([{ name: "photo", maxCount: 10 }]),
    recipesController.updateRecipe
  )

  .delete(verifyJWT, recipesController.deleteRecipe);

module.exports = router;

const express = require("express");
const router = express.Router();
const recipesController = require("../controllers/recipesController");

router
  .route("/")
  .get(recipesController.getAllRecipes)
  .post(recipesController.createNewRecipe)
  .patch(recipesController.updateRecipe)
  .delete(recipesController.deleteRecipe);

module.exports = router;

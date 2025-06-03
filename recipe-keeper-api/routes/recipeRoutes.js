const express = require("express");
const router = express.Router();
const recipesController = require("../controllers/recipesController");
const verifyJWT = require("../middleware/verifyJWT");

// router.use(verifyJWT);

router.get("/", recipesController.getAllRecipes);

router
  .route("/")
  // .get(recipesController.getAllRecipes)
  .post(recipesController.createNewRecipe)
  .patch(recipesController.updateRecipe)
  .delete(recipesController.deleteRecipe);

module.exports = router;

const Recipe = require("../models/Recipe");
const User = require("../models/User");
const asyncHandler = require("express-async-handler");

// @desc Get all Recipes
// @route GET /recipes
// @access Private
const getAllRecipes = asyncHandler(async (req, res) => {
  // Get all recipes from MongoDB
  const recipes = await Recipe.find().lean();

  // If no recipe
  if (!recipes?.length) {
    return res.status(400).json({ message: "No recipes found" });
  }

  // Add username to each recipe before sending the response
  const recipesWithUser = await Promise.all(
    recipes.map(async (recipe) => {
      const user = await User.findById(recipe.user).lean().exec();
      return { ...recipe, username: user.username };
    })
  );

  res.json(recipesWithUser);
});

// @desc Create a Recipe
// @route POST /recipes
// @access Private
const createNewRecipe = asyncHandler(async (req, res) => {
  const {
    user,
    title,
    course,
    photo,
    time,
    ingredients,
    instructions,
    favorited,
  } = req.body;

  // Confirm data
  if (!user || !title || !ingredients || !instructions) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Create and store the new recipe
  const recipe = await Recipe.create({
    user,
    title,
    course,
    photo,
    time,
    ingredients,
    instructions,
    favorited,
  });

  if (recipe) {
    return res.status(201).json({ message: "New Recipe created" });
  } else {
    return res.status(400).json({ message: "Invalid recipe data recieved" });
  }
});

// @desc Update a Recipe
// @route PATCH /recipes
// @access Private
const updateRecipe = asyncHandler(async (req, res) => {
  const {
    id,
    user,
    title,
    course,
    photo,
    time,
    ingredients,
    instructions,
    favorited,
  } = req.body;

  // Confirm data
  if (!id || !user || !title || !ingredients || !instructions) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Confirm recipe exists to update
  const recipe = await Recipe.findById(id).exec();

  if (!recipe) {
    return res.status(400).json({ message: "Recipe not found" });
  }

  recipe.user = user;
  recipe.title = title;
  recipe.course = course;
  recipe.photo = photo;
  recipe.time = time;
  recipe.ingredients = ingredients;
  recipe.instructions = instructions;
  recipe.favorited = favorited;

  const updatedRecipe = await recipe.save();

  res.json(`'${updatedRecipe.title}' updated`);
  console.log("✅ PATCH hit with data:", req.body);
});

// @desc Delete a Recipe
// @route DELETE /recipes
// @access Private
const deleteRecipe = asyncHandler(async (req, res) => {
  const { id } = req.body;

  // Confirm data
  if (!id) {
    return res.status(400).json({ message: "Note ID required" });
  }

  // Confirm recipe exists to delete
  const recipe = await Recipe.findById(id).exec();

  if (!recipe) {
    return res.status(400).json({ message: "Recipe not found" });
  }

  const result = await recipe.deleteOne();

  const reply = `Recipe '${result.title}' with ID ${result._id} deleted`;

  res.json(reply);
});

module.exports = {
  getAllRecipes,
  createNewRecipe,
  updateRecipe,
  deleteRecipe,
};

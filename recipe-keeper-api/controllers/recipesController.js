const Recipe = require("../models/Recipe");
const User = require("../models/User");

// @desc Get all Recipes
// @route GET /recipes
// @access Private
const getAllRecipes = async (req, res) => {
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
      return { ...recipe, username: user ? user.username : "Deleted User" };
    })
  );

  res.json(recipesWithUser);
};

// @desc Create a Recipe
// @route POST /recipes
// @access Private
const createNewRecipe = async (req, res) => {
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
    time: {
      hours: Number(time?.hours) || 0,
      minutes: Number(time?.minutes) || 0,
    },
    ingredients,
    instructions,
    favorited,
  });

  if (recipe) {
    return res.status(201).json({ message: "New Recipe created" });
  } else {
    return res.status(400).json({ message: "Invalid recipe data recieved" });
  }
};

// @desc Update a Recipe
// @route PATCH /recipes
// @access Private
const updateRecipe = async (req, res) => {
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

  if (!id) {
    return res.status(400).json({ message: "Recipe ID is required" });
  }

  // Confirm recipe exists to update
  const recipe = await Recipe.findById(id).exec();

  if (!recipe) {
    return res.status(400).json({ message: "Recipe not found" });
  }

  if (user !== undefined) recipe.user = user;
  if (title !== undefined) recipe.title = title;
  if (course !== undefined) recipe.course = course;
  if (photo !== undefined) recipe.photo = photo;
  if (time !== undefined) {
    recipe.time = {
      hours: Number(time?.hours) || 0,
      minutes: Number(time?.minutes) || 0,
    };
  }
  if (ingredients !== undefined) recipe.ingredients = ingredients;
  if (instructions !== undefined) recipe.instructions = instructions;
  if (favorited !== undefined) recipe.favorited = favorited;

  const updatedRecipe = await recipe.save();
  updatedRecipe.id = updatedRecipe._id;

  // console.log("✅ PATCH hit with data:", req.body);
  res.json(updatedRecipe);
};

// @desc Delete a Recipe
// @route DELETE /recipes
// @access Private
const deleteRecipe = async (req, res) => {
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
};

module.exports = {
  getAllRecipes,
  createNewRecipe,
  updateRecipe,
  deleteRecipe,
};

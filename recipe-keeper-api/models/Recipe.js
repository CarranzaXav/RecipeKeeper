const { time } = require("console");

mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const recipeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  title: {
    type: String,
    required: true,
  },
  photo: {
    url: String,
  },
  time: {
    type: Number,
  },
  ingredients: {
    type: String,
    required: true,
  },
  instructions: {
    type: String,
    required: true,
  },
  favorited: {
    type: Boolean,
    default: false,
  },
});

recipeSchema.plugin(AutoIncrement, {
  inc_field: "recipe",
  id: "recipeTicket",
  start_seq: 500,
});

module.exports = mongoose.model("Recipe", recipeSchema);

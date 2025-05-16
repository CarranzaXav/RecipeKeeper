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
    type: Image,
  },
  time: {
    type: Number,
  },
  ingredients: {
    type: String,
    required: true,
  },
  steps: {
    type: String,
    required: true,
  },
  favorited: {
    type: Boolean,
    default: falses,
  },
});

recipeSchema.plugin(AutoIncrement, {
  inc_field: "recipe",
  id: "recipeTicket",
  start_seq: 500,
});

module.exports = mongoose.model("Recipe", recipeSchema);

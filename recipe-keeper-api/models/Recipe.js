// mongoose = require("mongoose");
const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const recipeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    title: {
      type: String,
      required: true,
    },
    course: {
      type: [String],
    },
    photo: {
      type: String,
    },
    time: {
      type: Number,
    },
    ingredients: {
      type: Array,
      required: true,
    },
    instructions: {
      type: Array,
      required: true,
    },
    favorited: {
      type: Object,
      default: {},
    },
  },
  { timestamps: true }
);

recipeSchema.plugin(AutoIncrement, {
  inc_field: "recipe",
  id: "recipeTicket",
  start_seq: 500,
});

module.exports = mongoose.model("Recipe", recipeSchema);

// mongoose = require("mongoose");
const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);
const Schema = mongoose.Schema;

const ImageSchema = new Schema({ url: String, filename: String });

ImageSchema.virtual("thumbnail").get(() => {
  return this.url.replace("/upload", "/upload/w_200");
});

const recipeSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
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
    photo: [ImageSchema],
    time: {
      hours: { type: Number, default: 0 },
      minutes: { type: Number, default: 0 },
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

const mongoose = require("mongoose");

const farmSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    location: {
      type: String,
      required: true
    },
    soilType: {
      type: String,
      required: true
    },
    landArea: {
      type: Number,
      required: true
    },
    season: {
      type: String,
      required: true
    },
    notes: {
      type: String,
      default: ""
    },
    imageUrl: {
      type: String,
      default: ""
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Farm", farmSchema);
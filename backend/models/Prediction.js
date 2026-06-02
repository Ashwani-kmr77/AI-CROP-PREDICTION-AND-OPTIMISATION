const mongoose = require("mongoose");

const predictionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    farmId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Farm",
      default: null
    },
    inputData: {
      type: Object,
      required: true
    },
    predictedCrop: String,
    yieldEstimate: Number,
    fertilizerAdvice: String,
    irrigationAdvice: String,
    alternatives: [String],
    profitEstimate: Number,
    confidence: Number,
    budgetAdvice: String,
    waterAdvice: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("Prediction", predictionSchema);
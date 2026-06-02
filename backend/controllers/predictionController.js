const axios = require("axios");
const Prediction = require("../models/Prediction");

const predictCrop = async (req, res) => {
    try {
        const payload = req.body;

        const mlResponse = await axios.post(
            `${process.env.ML_SERVICE_URL}/predict`,
            payload
        );

        const result = mlResponse.data;

        const savedPrediction = await Prediction.create({
            userId: req.user.id,
            farmId: payload.farmId || null,
            inputData: payload,
            predictedCrop: result.predicted_crop,
            yieldEstimate: result.yield_estimate,
            fertilizerAdvice: result.fertilizer_advice,
            irrigationAdvice: result.irrigation_advice,
            alternatives: result.alternatives,
            profitEstimate: result.profit_estimate,
            confidence: result.confidence,
            budgetAdvice: result.budget_advice,
            waterAdvice: result.water_advice
        });

        res.status(200).json({
            success: true,
            result,
            savedPrediction
        });
    } catch (error) {
        res.status(500).json({
            message: "Prediction failed",
            error: error.message
        });
    }
};

const getPredictionHistory = async (req, res) => {
    try {
        const predictions = await Prediction.find({ userId: req.user.id }).sort({ createdAt: -1 });

        res.status(200).json(predictions);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch history",
            error: error.message
        });
    }
};

module.exports = { predictCrop, getPredictionHistory };
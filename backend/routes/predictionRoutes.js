const express = require("express");
const router = express.Router();

const {
    predictCrop,
    getPredictionHistory
} = require("../controllers/predictionController");



const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, predictCrop);
router.get("/history", authMiddleware, getPredictionHistory);

module.exports = router;
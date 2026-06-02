require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// serve uploaded images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
    res.send("AI Crop Backend Running");
});

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

try {
    const authRoutes = require("./routes/authRoutes");
    console.log("authRoutes loaded");
    app.use("/api/auth", authRoutes);
} catch (err) {
    console.log("authRoutes error:", err.message);
}

try {
    const farmRoutes = require("./routes/farmRoutes");
    console.log("farmRoutes loaded");
    app.use("/api/farms", farmRoutes);
} catch (err) {
    console.log("farmRoutes error:", err.message);
}

try {
    const predictionRoutes = require("./routes/predictionRoutes");
    console.log("predictionRoutes loaded");
    app.use("/api/predict", predictionRoutes);
} catch (err) {
    console.log("predictionRoutes error:", err.message);
}

if (!MONGO_URI) {
    console.log("MONGO_URI is missing in .env");
    process.exit(1);
}

mongoose
    .connect(MONGO_URI)
    .then(() => {
        console.log("MongoDB connected");
        app.listen(PORT, () => {
            console.log(`Server running at http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.log("MongoDB connection error:", err.message);
    });
const Farm = require("../models/Farm");

const createFarm = async (req, res) => {
    try {
        const { location, soilType, landArea, season, notes } = req.body;

        const farm = new Farm({
            user: req.user.id,
            location,
            soilType,
            landArea,
            season,
            notes,
            imageUrl: req.file ? `http://localhost:5000/uploads/${req.file.filename}` : ""
        });

        await farm.save();

        res.status(201).json({
            message: "Farm added successfully",
            farm
        });
    } catch (error) {
        console.error("Create farm error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

const getAllFarms = async (req, res) => {
    try {
        const farms = await Farm.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json(farms);
    } catch (error) {
        console.error("Get farms error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = { createFarm, getAllFarms };
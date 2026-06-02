const express = require("express");
const router = express.Router();
const multer = require("multer");

const { createFarm, getAllFarms } = require("../controllers/farmController");
const authMiddleware = require("../middleware/authMiddleware");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const upload = multer({ storage });

router.post("/", authMiddleware, upload.single("farmImage"), createFarm);
router.get("/", authMiddleware, getAllFarms);

module.exports = router;
const express = require("express");
const multer = require("multer");
const Detail = require("../models/Detail");

const router = express.Router();

// Multer storage for logo uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "StoreDetail/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// POST Add Store Details
router.post("/addDetail", upload.single("logo"), async (req, res) => {
  try {
    const { storeName } = req.body;
    const logo = req.file ? `/StoreDetail/${req.file.filename}` : null;

    // Check if a store detail already exists
    let existingDetail = await Detail.findOne();

    if (existingDetail) {
      // Update the existing record
      existingDetail.storeName = storeName || existingDetail.storeName;
      if (logo) existingDetail.logo = logo; // Update logo only if a new one is uploaded

      await existingDetail.save();
      return res.json({
        message: "Store details updated successfully",
        detail: existingDetail,
      });
    } else {
      // Create a new record if none exists
      const newDetail = new Detail({ storeName, logo });
      await newDetail.save();
      return res.json({
        message: "Store details added successfully",
        detail: newDetail,
      });
    }
  } catch (err) {
    res.status(500).json({ error: "Error processing store details" });
  }
});

// PUT Update Store Details
router.put("/updateDetail", upload.single("logo"), async (req, res) => {
  try {
    const { storeName } = req.body;
    const logo = req.file ? `/StoreDetail/${req.file.filename}` : null;

    let existingDetail = await Detail.findOne();
    if (!existingDetail) {
      return res.status(404).json({ error: "Store details not found" });
    }

    if (storeName) existingDetail.storeName = storeName;
    if (logo) existingDetail.logo = logo; // Update logo only if a new one is uploaded

    await existingDetail.save();
    res.json({
      message: "Store details updated successfully",
      detail: existingDetail,
    });
  } catch (err) {
    res.status(500).json({ error: "Error updating store details" });
  }
});

// GET Store Details
router.get("/getDetail", async (req, res) => {
  try {
    const details = await Detail.find();
    res.json(details);
  } catch (err) {
    res.status(500).json({ error: "Error fetching store details" });
  }
});

module.exports = router;

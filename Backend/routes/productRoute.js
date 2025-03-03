const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const Product = require("../models/product");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// Add Product Route
router.post("/addproduct", upload.single("ProImage"), async (req, res) => {
  try {
    const {
      Probarcode,
      ProductName,
      Category,
      RetailPrice,
      CostPrice,
      Unit,
      Quantity,
    } = req.body;
    const ProImage = req.file ? req.file.filename : null;

    const newProduct = new Product({
      Probarcode,
      ProductName,
      Category,
      RetailPrice,
      CostPrice,
      ProImage,
      Unit,
      Quantity,
    });

    await newProduct.save();
    res
      .status(201)
      .json({ message: "Product added successfully", product: newProduct });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update Product Route
router.put(
  "/updateproduct/:id",
  upload.single("ProImage"),
  async (req, res) => {
    try {
      const {
        Probarcode,
        ProductName,
        Category,
        RetailPrice,
        CostPrice,
        Unit,
        Quantity,
      } = req.body;
      const ProImage = req.file ? req.file.filename : undefined;

      const updatedData = {
        Probarcode,
        ProductName,
        Category,
        RetailPrice,
        CostPrice,
        Unit,
        Quantity,
      };
      if (ProImage) updatedData.ProImage = ProImage;

      const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        updatedData,
        { new: true }
      );

      if (!updatedProduct) {
        return res.status(404).json({ message: "Product not found" });
      }

      res.status(200).json({
        message: "Product updated successfully",
        product: updatedProduct,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Delete Product Route
router.delete("/deleteproduct/:id", async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Single Product Route
router.get("/getproduct/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ product });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get All Product Route
router.get("/getproducts", async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({ products });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Total No. of Product Route
router.get("/totalproducts", async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    res.status(200).json({ total: totalProducts });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

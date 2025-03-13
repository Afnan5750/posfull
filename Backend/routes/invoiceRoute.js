const express = require("express");
const Invoice = require("../models/Invoice");
const Product = require("../models/Product");
const mongoose = require("mongoose");

const router = express.Router();

// Create a new invoice
router.post("/addinvoice", async (req, res) => {
  try {
    const { items } = req.body;

    // Step 1: Check stock availability for all products
    for (const item of items) {
      const product = await Product.findOne({ Probarcode: item.Probarcode });

      if (!product) {
        return res.status(400).json({
          message: `Product with barcode ${item.Probarcode} not found`,
        });
      }

      if (product.Quantity < item.Quantity) {
        return res.status(400).json({
          message: `Not enough stock for ${product.ProductName}. Available: ${product.Quantity}, Requested: ${item.Quantity}`,
        });
      }
    }

    // Step 2: Create the invoice after stock validation
    const invoice = new Invoice(req.body);
    await invoice.save();

    // Step 3: Deduct stock quantity after invoice creation
    for (const item of items) {
      const product = await Product.findOne({ Probarcode: item.Probarcode });

      product.Quantity -= item.Quantity;
      await product.save();
    }

    res.status(201).json({
      message: "Invoice added and stock updated successfully",
      invoice,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding invoice", error: error.message });
  }
});

// Update an invoice
router.put("/updateinvoice/:id", async (req, res) => {
  try {
    const invoiceId = req.params.id;
    const updatedData = req.body;

    // 1️⃣ Find the existing invoice
    const existingInvoice = await Invoice.findById(invoiceId);
    if (!existingInvoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    // 2️⃣ Check stock availability BEFORE modifying anything
    for (const newItem of updatedData.items) {
      const product = await Product.findOne({
        ProductName: newItem.ProductName,
      });

      if (!product) {
        return res
          .status(400)
          .json({ message: `Product ${newItem.ProductName} not found` });
      }

      // Get old quantity from existing invoice
      const oldItem = existingInvoice.items.find(
        (item) => item.ProductName === newItem.ProductName
      );
      const previousQuantity = oldItem ? oldItem.Quantity : 0;
      const availableStock = product.Quantity + previousQuantity; // Virtually restore stock

      if (availableStock < newItem.Quantity) {
        return res.status(400).json({
          message: `Not enough stock for ${product.ProductName}. Available: ${availableStock}, Requested: ${newItem.Quantity}`,
        });
      }
    }

    // 3️⃣ Restore old stock quantities
    for (const oldItem of existingInvoice.items) {
      const product = await Product.findOne({
        ProductName: oldItem.ProductName,
      });
      if (product) {
        product.Quantity += oldItem.Quantity; // Restore old quantity
        await product.save();
      }
    }

    // 4️⃣ Apply new stock adjustments
    for (const newItem of updatedData.items) {
      const product = await Product.findOne({
        ProductName: newItem.ProductName,
      });
      product.Quantity -= newItem.Quantity; // Reduce stock based on new quantity
      await product.save();
    }

    // 5️⃣ Update the invoice
    const updatedInvoice = await Invoice.findByIdAndUpdate(
      invoiceId,
      { $set: updatedData },
      { new: true }
    );

    res.status(200).json({
      message: "Invoice updated and stock adjusted successfully",
      updatedInvoice,
    });
  } catch (error) {
    console.error("Error updating invoice:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get all invoices
router.get("/getinvoices", async (req, res) => {
  try {
    const invoices = await Invoice.find();
    res.status(200).json(invoices);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching invoices", error: error.message });
  }
});

// Get a specific invoice by ID
router.get("/getinvoice/:id", async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) return res.status(404).json({ message: "Invoice not found" });
    res.status(200).json(invoice);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching invoice", error: error.message });
  }
});

// Delete an invoice
router.delete("/deleteinvoice/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid invoice ID" });
    }

    // 1️⃣ Find the invoice before deletion
    const invoice = await Invoice.findById(id);
    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    // 2️⃣ Restore product quantities
    for (const item of invoice.items) {
      const product = await Product.findOne({ ProductName: item.ProductName });
      if (product) {
        product.Quantity += item.Quantity; // Add back the sold quantity
        await product.save();
      }
    }

    // 3️⃣ Delete the invoice
    await Invoice.findByIdAndDelete(id);

    res
      .status(200)
      .json({ message: "Invoice deleted and stock restored successfully" });
  } catch (error) {
    console.error("Delete Error:", error);
    res
      .status(500)
      .json({ message: "Error deleting invoice", error: error.message });
  }
});

// Get invoice by date range
router.get("/getInvoicesByDateRange", async (req, res) => {
  try {
    let { startDate, endDate } = req.query;

    // If no startDate or endDate is provided, set default values
    if (!startDate || !endDate) {
      return res
        .status(400)
        .json({ message: "Start and end date are required." });
    }

    // Convert string dates to JavaScript Date objects
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59); // Ensure it includes the entire end date

    const invoices = await Invoice.find({
      createdAt: { $gte: start, $lte: end },
    });

    res.status(200).json(invoices);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching invoices by date range",
      error: error.message,
    });
  }
});

// Get invoice count of current month
router.get("/getMonthlyInvoiceCount", async (req, res) => {
  try {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const currentDayOfMonth = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      23,
      59,
      59
    ); // End of the current day

    // Get the total count of invoices in the current month
    const invoiceCount = await Invoice.countDocuments({
      createdAt: { $gte: firstDayOfMonth, $lte: currentDayOfMonth },
    });

    res.status(200).json({ totalInvoices: invoiceCount });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching monthly invoice count",
      error: error.message,
    });
  }
});

module.exports = router;

const express = require("express");
const Invoice = require("../models/Invoice");
const mongoose = require("mongoose");

const router = express.Router();

// Create a new invoice
router.post("/addinvoice", async (req, res) => {
  try {
    const invoice = new Invoice(req.body);
    await invoice.save();
    res.status(201).json({ message: "Invoice added successfully", invoice });
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

    const updatedInvoice = await Invoice.findByIdAndUpdate(
      invoiceId,
      { $set: updatedData },
      { new: true } // Return the updated document
    );

    if (!updatedInvoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    res.status(200).json(updatedInvoice);
  } catch (error) {
    console.error("Error updating invoice:", error);
    res.status(500).json({ message: "Server error", error });
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

    const deletedInvoice = await Invoice.findByIdAndDelete(id);
    if (!deletedInvoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    res.status(200).json({ message: "Invoice deleted successfully" });
  } catch (error) {
    console.error("Delete Error:", error); // Debugging
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

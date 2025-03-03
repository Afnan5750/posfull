const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    Probarcode: { type: String, required: true, unique: true },
    ProductName: { type: String, required: true },
    Category: { type: String, required: true },
    RetailPrice: { type: Number, required: true }, // The price at which the product is sold to customers.
    CostPrice: { type: Number, required: true }, // The price at which the product was purchased.
    ProImage: { type: String, required: true },
    Unit: { type: String, required: true },
    Quantity: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);

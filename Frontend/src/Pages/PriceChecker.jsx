import React, { useState, useEffect, useRef } from "react";
import "../Styles/PriceChecker.css";
import posLogo from "../assets/images/apple.jpg";
import placeholderImage from "../assets/images/product-placeholder.jpg";

const PriceChecker = () => {
  const [barcode, setBarcode] = useState("");
  const [productName, setProductName] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const barcodeInputRef = useRef(null);

  const dummyProducts = [
    { id: 1, name: "Apple", image: posLogo, price: 15, barcode: "40611513084" },
    {
      id: 2,
      name: "Avocado",
      image: posLogo,
      price: 20,
      barcode: "2345678901234",
    },
    {
      id: 3,
      name: "Banana",
      image: posLogo,
      price: 75,
      barcode: "3456789012345",
    },
    {
      id: 4,
      name: "Blueberry",
      image: posLogo,
      price: 35,
      barcode: "4567890123456",
    },
    {
      id: 5,
      name: "Cherry",
      image: posLogo,
      price: 40,
      barcode: "5678901234567",
    },
    {
      id: 6,
      name: "Carrot",
      image: posLogo,
      price: 12,
      barcode: "6789012345678",
    },
  ];

  useEffect(() => {
    if (barcodeInputRef.current) {
      barcodeInputRef.current.focus();
    }
  }, []);

  const handleBarcodeSearch = (e) => {
    const scannedBarcode = e.target.value;
    setBarcode(scannedBarcode);
    setProductName("");
    setFilteredProducts([]);

    const foundProduct = dummyProducts.find(
      (p) => p.barcode === scannedBarcode
    );
    setSelectedProduct(foundProduct || null);
  };

  const handleProductSearch = (e) => {
    const searchQuery = e.target.value;
    setProductName(searchQuery);
    setBarcode("");

    if (searchQuery.length > 0) {
      // Filter products based on search input
      const matches = dummyProducts.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProducts(matches);
    } else {
      setFilteredProducts([]);
      setSelectedProduct(null); // Clear selected product when input is empty
    }
  };

  const handleProductSelect = (product) => {
    setSelectedProduct(product);
    setProductName(product.name);
    setFilteredProducts([]); // Hide dropdown after selection
  };

  return (
    <div className="price-checker-container">
      <h2 className="heading-text">Price Checker</h2>

      {/* Barcode Input */}
      <div className="input-group-container">
        <label className="input-label-text">Scan or Enter Barcode</label>
        <input
          type="text"
          className="input-field-box"
          placeholder="Scan Barcode"
          value={barcode}
          onChange={handleBarcodeSearch}
          ref={barcodeInputRef}
        />
      </div>

      {/* Product Name Input with Dropdown */}
      <div className="input-group-container">
        <label className="input-label-text">Search by Product Name</label>
        <input
          type="text"
          className="input-field-box"
          placeholder="Enter Product Name"
          value={productName}
          onChange={handleProductSearch}
        />
        {/* Dropdown */}
        {filteredProducts.length > 0 && (
          <ul className="dropdown-list">
            {filteredProducts.map((product) => (
              <li
                key={product.id}
                className="dropdown-item"
                onClick={() => handleProductSelect(product)}
              >
                {product.name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Permanent Product Display Section */}
      <div className="product-display-container">
        {/* Left Side: Product Details */}
        <div className="product-details">
          <h3 className="product-name">
            {selectedProduct ? selectedProduct.name : "Product Name"}
          </h3>
          <p className="product-price">
            {selectedProduct
              ? `Price: Rs.${selectedProduct.price.toFixed(2)}`
              : "Price: -"}
          </p>
        </div>

        {/* Right Side: Image Box (Always Visible) */}
        <div className="product-image-container">
          <img
            src={selectedProduct ? selectedProduct.image : placeholderImage}
            alt={selectedProduct ? selectedProduct.name : "Placeholder"}
            className="product-image-display"
          />
        </div>
      </div>
    </div>
  );
};

export default PriceChecker;

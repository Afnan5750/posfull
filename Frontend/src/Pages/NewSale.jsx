import React, { useState, useEffect, useRef } from "react";
import "../Styles/NewSale.css";
import { FaTrash } from "react-icons/fa";
import posLogo from "../assets/images/apple.jpg";
import placeholderImage from "../assets/images/product-placeholder.jpg";

const Newsale = () => {
  const [search, setSearch] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [barcode, setBarcode] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [contactNo, setContactNo] = useState("");
  const [cart, setCart] = useState([]);
  const barcodeInputRef = useRef(null);

  const dummyProducts = [
    {
      id: 1,
      name: "Apple",
      image: posLogo,
      price: 15,
      barcode: "40611513084",
    },
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

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearch(query);
    if (query.length > 0) {
      const filtered = dummyProducts.filter((p) =>
        p.name.toLowerCase().startsWith(query)
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts([]);
      setSelectedProduct(null);
    }
  };

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    setSearch(product.name);
    setFilteredProducts([]);
  };

  const handleAddToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
    setSelectedProduct(null);
    setSearch("");
    setBarcode("");
  };

  const handleRemoveFromCart = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const handleQuantityChange = (id, quantity) => {
    if (quantity <= 0) return;
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id ? { ...item, quantity: quantity } : item
      )
    );
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  // Handle barcode search
  const handleBarcodeSearch = (e) => {
    const scannedBarcode = e.target.value;
    setBarcode(scannedBarcode);

    const foundProduct = dummyProducts.find(
      (p) => p.barcode === scannedBarcode
    );
    if (foundProduct) {
      handleAddToCart(foundProduct);
    }
  };

  return (
    <div className="sales-container">
      <h2 className="heading-text">New Sale</h2>

      <div className="input-group-container full-width-container">
        <div className="customer-details-container">
          <div className="input-group-container half-width-box">
            <label className="input-label-text">Customer Name</label>
            <input
              type="text"
              className="input-field-box"
              placeholder="Enter Customer Name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />
          </div>

          <div className="input-group-container half-width-box">
            <label className="input-label-text">Contact Number</label>
            <input
              type="text"
              className="input-field-box"
              placeholder="Enter Contact Number"
              value={contactNo}
              onChange={(e) => setContactNo(e.target.value)}
            />
          </div>
        </div>

        {/* Barcode Input */}
        <label className="input-label-text">Scan Barcode</label>
        <input
          type="text"
          className="input-field-box"
          placeholder="Scan or Enter Barcode"
          value={barcode}
          onChange={handleBarcodeSearch}
          ref={barcodeInputRef}
        />
      </div>

      <div className="search-cart-container">
        <div className="input-group-container">
          <label className="input-label-text">Search Product</label>
          <input
            type="text"
            className="input-field-box"
            placeholder="Search Product"
            value={search}
            onChange={handleSearch}
          />
          {filteredProducts.length > 0 && (
            <ul className="dropdown-list">
              {filteredProducts.map((product) => (
                <li
                  key={product.id}
                  className="dropdown-item"
                  onClick={() => handleSelectProduct(product)}
                >
                  {product.name} - Rs.{product.price.toFixed(2)}
                </li>
              ))}
            </ul>
          )}
        </div>

        {selectedProduct && (
          <button
            className="add-to-cart-btn"
            onClick={() => handleAddToCart(selectedProduct)}
          >
            Add to Cart
          </button>
        )}

        <div className="product-image-wrapper">
          <img
            src={selectedProduct ? selectedProduct.image : placeholderImage}
            alt={selectedProduct ? selectedProduct.name : "Placeholder"}
            className="product-image-box"
          />
        </div>
      </div>

      <div className="cart-container">
        <h3 className="cart-heading">Cart</h3>
        {cart.length === 0 ? (
          <p className="cart-empty-message">No items in cart</p>
        ) : (
          <table className="cart-table">
            <thead>
              <tr>
                <th className="cart-header">Item Name</th>
                <th className="cart-header">Price</th>
                <th className="cart-header">Quantity</th>
                <th className="cart-header">Action</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => (
                <tr key={item.id} className="cart-row">
                  <td className="cart-item-name">{item.name}</td>
                  <td className="cart-item-price">
                    Rs.{item.price.toFixed(2)}
                  </td>
                  <td>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      className="quantity-input"
                      onChange={(e) =>
                        handleQuantityChange(item.id, parseInt(e.target.value))
                      }
                    />
                  </td>
                  <td>
                    <button
                      className="remove-btn"
                      onClick={() => handleRemoveFromCart(item.id)}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <h4 className="cart-total">Total: Rs.{getTotalPrice().toFixed(2)}</h4>
      </div>
    </div>
  );
};

export default Newsale;

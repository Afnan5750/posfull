import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../Styles/NewSale.css";
import { FaTrash } from "react-icons/fa";
import placeholderImage from "../assets/images/product-placeholder.jpg";

const Newsale = () => {
  const [search, setSearch] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [barcode, setBarcode] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerContactNo, setCustomerContactNo] = useState("");
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [paidAmount, setpaidAmount] = useState();
  const [changeAmount, setchangeAmount] = useState();
  const barcodeInputRef = useRef(null);
  const customerPaidRef = useRef(null);
  const { invoiceId } = useParams();
  const navigate = useNavigate();

  // for fetch invoice data in console
  const fetchInvoiceData = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/invoice/getinvoice/${id}`
      );
      const data = await response.json();

      if (data) {
        console.log("Invoice Data:", data); // Debugging
        setCustomerName(data.customerName || "");
        setCustomerContactNo(data.customerContactNo || "");
        setpaidAmount(data.paidAmount || 0);
        setchangeAmount(data.changeAmount || 0);

        // Handling product items if present
        if (data.items && data.items.length > 0) {
          setCart(
            data.items.map((item, index) => ({
              id: item._id || `temp-${index}`, // Ensure a unique key
              name: item.ProductName,
              retailprice: item.RetailPrice,
              costprice: item.CostPrice,
              quantity: item.Quantity,
            }))
          );
        }
      }
    } catch (err) {
      console.error("Error fetching invoice:", err);
    }
  };

  // Fetch invoice data on component mount when invoiceId is available
  useEffect(() => {
    if (invoiceId) {
      fetchInvoiceData(invoiceId);
    }
  }, [invoiceId]);

  // Fetch products from the API
  useEffect(() => {
    fetch("http://localhost:5000/api/product/getproducts")
      .then((response) => response.json())
      .then((data) => {
        const productsFromAPI = data.products.map((product) => ({
          id: product._id,
          name: product.ProductName,
          image: product.ProImage
            ? `http://localhost:5000/uploads/${product.ProImage}`
            : placeholderImage,
          retailprice: product.RetailPrice,
          costprice: product.CostPrice,
          Category: product.Category,
          Company: product.Company,
          Unit: product.Unit,
          ExpiryDate: product.ExpiryDate,
          quantity: product.Quantity,
          barcode: product.Probarcode.toString(),
        }));
        setProducts(productsFromAPI);
      })
      .catch((error) => console.error("Error fetching products:", error));
  }, []);

  useEffect(() => {
    if (barcodeInputRef.current) {
      barcodeInputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (isModalOpen && customerPaidRef.current) {
      customerPaidRef.current.focus();
      customerPaidRef.current.parentNode.classList.add("focused");
    }
  }, [isModalOpen]);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearch(query);
    if (query.length > 0) {
      const filtered = products.filter((p) =>
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
    return cart.reduce(
      (total, item) => total + item.retailprice * item.quantity,
      0
    );
  };

  // Handle barcode search
  const handleBarcodeSearch = (e) => {
    const scannedBarcode = e.target.value;
    setBarcode(scannedBarcode);

    const foundProduct = products.find((p) => p.barcode === scannedBarcode);
    if (foundProduct) {
      handleAddToCart(foundProduct);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setpaidAmount(false);
  };

  // Add invoice API call
  const handleAddInvoice = async () => {
    if (!cart.length) {
      alert("Cart is empty! Please add items before generating an invoice.");
      return;
    }

    // Calculate total profit and add Profit field to each item
    const updatedItems = cart.map((item, index) => {
      const costPrice = item.CostPrice ?? item.costprice ?? 0;
      const retailPrice = item.RetailPrice ?? item.retailprice ?? 0;
      const quantity = item.Quantity ?? item.quantity ?? 1;

      // Calculate profit
      const profit = (retailPrice - costPrice) * quantity;

      // Debugging logs
      console.log(
        `Item ${index + 1}:`,
        `RetailPrice: ${retailPrice},`,
        `CostPrice: ${costPrice},`,
        `Quantity: ${quantity},`,
        `Profit: ${profit}`
      );

      return {
        Probarcode: item.Probarcode || item.barcode,
        ProductName: item.ProductName || item.name,
        Category: item.Category || "Unknown",
        Company: item.Company || "Unknown",
        RetailPrice: retailPrice,
        CostPrice: costPrice, // Ensure CostPrice is included
        Profit: profit, // Corrected Profit calculation
        ProImage: item.ProImage || item.image,
        Unit: item.Unit || "N/A",
        Quantity: quantity,
        ExpiryDate: item.ExpiryDate || new Date().toISOString(),
      };
    });

    // Calculate total profit for the invoice
    const totalProfit = updatedItems.reduce(
      (acc, item) => acc + item.Profit,
      0
    );

    // Debugging log for totalProfit
    console.log("Total Profit:", totalProfit);

    const invoiceData = {
      customerName: customerName || "Walk-in Customer",
      customerContactNo: customerContactNo || 0,
      totalAmount: getTotalPrice().toFixed(2),
      paidAmount: paidAmount || 0,
      changeAmount: changeAmount || 0,
      totalProfit,
      items: updatedItems,
    };

    try {
      const response = await fetch(
        "http://localhost:5000/api/invoice/addinvoice",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(invoiceData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        console.log("Invoice added successfully:", data);
        setIsModalOpen(false);
        setCart([]);
        alert("Invoice added successfully!");
      } else {
        console.error("Error adding invoice:", data);
        alert(data.message || "Error adding invoice!"); // Show server message
      }
    } catch (error) {
      console.error("Error adding invoice:", error);
      alert("Error adding invoice: " + error.message);
    }
  };

  // Update Invoice API Call
  const handleUpdateInvoice = async () => {
    if (!cart.length) {
      alert("Cart is empty! Please add items before updating the invoice.");
      return;
    }

    const updatedItems = cart.map((item, index) => {
      const costPrice =
        item.CostPrice !== undefined && item.CostPrice !== null
          ? item.CostPrice
          : item.costprice !== undefined && item.costprice !== null
          ? item.costprice
          : 0;

      const retailPrice = item.RetailPrice || item.retailprice || 0;
      const quantity = item.Quantity || item.quantity || 1;

      const profit = (retailPrice - costPrice) * quantity;

      console.log(
        `Item ${index + 1}:`,
        `RetailPrice: ${retailPrice},`,
        `CostPrice: ${costPrice},`,
        `Quantity: ${quantity},`,
        `Profit: ${profit}`
      );

      return {
        Probarcode: item.Probarcode || item.barcode,
        ProductName: item.ProductName || item.name,
        Category: item.Category || "Unknown",
        Company: item.Company || "Unknown",
        RetailPrice: retailPrice,
        CostPrice: costPrice,
        Profit: profit,
        ProImage: item.ProImage || item.image,
        Unit: item.Unit || "N/A",
        Quantity: quantity,
        ExpiryDate: item.ExpiryDate || new Date().toISOString(),
      };
    });

    const totalProfit = updatedItems.reduce(
      (acc, item) => acc + item.Profit,
      0
    );
    console.log("Total Profit:", totalProfit);

    const updatedInvoiceData = {
      customerName: customerName || "Walk-in Customer",
      customerContactNo: customerContactNo || 0,
      totalAmount: getTotalPrice().toFixed(2),
      paidAmount: paidAmount || 0,
      changeAmount: changeAmount || 0,
      totalProfit,
      items: updatedItems,
    };

    try {
      const response = await fetch(
        `http://localhost:5000/api/invoice/updateinvoice/${invoiceId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedInvoiceData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        console.log("Invoice updated successfully:", data);
        setIsModalOpen(false);
        alert("Invoice updated successfully!");

        setCustomerName("");
        setCustomerContactNo("");
        setpaidAmount(0);
        setchangeAmount(0);
        setCart([]);

        navigate("/sales/new-sale");

        setTimeout(() => {
          window.location.reload();
        }, 100);
      } else {
        console.error("Error updating invoice:", data);
        alert(data.message || "Error updating invoice!");
      }
    } catch (error) {
      console.error("Error updating invoice:", error);
      alert(error.message || "Error updating invoice!");
    }
  };

  useEffect(() => {
    setchangeAmount((paidAmount - getTotalPrice()).toFixed(2));
  }, [paidAmount, getTotalPrice]);

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
              value={customerContactNo}
              onChange={(e) => setCustomerContactNo(e.target.value)}
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
                  {product.name} - Rs.{product.retailprice.toFixed(2)} (Qty:
                  {product.quantity})
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
                    Rs.{" "}
                    {item.retailprice ? item.retailprice.toFixed(2) : "0.00"}
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

        {cart.length > 0 && (
          <>
            {invoiceId ? (
              <button
                className="modal-submit-btn update-btn"
                onClick={() => setIsModalOpen(true)}
              >
                Update
              </button>
            ) : (
              <button
                className="modal-submit-btn pay-btn"
                onClick={() => setIsModalOpen(true)}
              >
                Pay
              </button>
            )}
          </>
        )}

        {/* Custom Modal */}
        {isModalOpen && (
          <div className="modal-overlay custom-modal">
            <div className="modal-content">
              <span
                className="modal-close custom-modal-close"
                onClick={closeModal}
              >
                &times;
              </span>
              <h3 className="modal-title">
                {invoiceId ? "Update Invoice" : "Confirm Payment"}
              </h3>

              {/* Total Amount (Read-only) */}
              <div className="input-group focused">
                <input
                  type="text"
                  className="modal-input"
                  value={getTotalPrice().toFixed(2)}
                  readOnly
                />
                <label className="floating-label">Total Amount (Rs.)</label>
              </div>

              {/* Customer Paid */}
              <div className="input-group">
                <input
                  type="number"
                  className="modal-input"
                  required
                  value={paidAmount || ""}
                  ref={customerPaidRef}
                  onFocus={(e) => e.target.parentNode.classList.add("focused")}
                  onBlur={(e) => {
                    if (!e.target.value) {
                      e.target.parentNode.classList.remove("focused");
                    }
                  }}
                  onChange={(e) => setpaidAmount(e.target.value)}
                />
                <label className="floating-label">Customer Paid (Rs.)</label>
              </div>

              {/* Change (Read-only) */}
              <div className="input-group focused">
                <input
                  type="text"
                  className="modal-input"
                  value={changeAmount}
                  readOnly
                />
                <label className="floating-label">Change (Rs.)</label>
              </div>

              <div className="modal-buttons">
                {invoiceId ? (
                  <button
                    className="modal-submit-btn update-btn"
                    onClick={handleUpdateInvoice}
                    disabled={
                      paidAmount <= getTotalPrice() || isNaN(paidAmount)
                    }
                  >
                    Update Invoice
                  </button>
                ) : (
                  <button
                    className={`modal-submit-btn confirm-btn ${
                      paidAmount > getTotalPrice()
                        ? "enabled-btn"
                        : "disabled-btn"
                    }`}
                    onClick={handleAddInvoice}
                    disabled={
                      paidAmount < getTotalPrice() ||
                      isNaN(paidAmount) ||
                      paidAmount === ""
                    }
                  >
                    Confirm Payment
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Newsale;

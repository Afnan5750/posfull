import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaTachometerAlt,
  FaShoppingCart,
  FaBox,
  FaUsers,
  FaChartBar,
  FaUserShield,
  FaFileInvoiceDollar,
  FaSignOutAlt,
  FaAngleDown,
  FaFileInvoice,
  FaChartLine,
  FaExclamationTriangle,
  FaBoxes,
  FaThList,
  FaTag,
  FaExclamationCircle,
} from "react-icons/fa";
import "./Sidebar.css";
import logo from "../../assets/images/pos-logo.png";

const Sidebar = () => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Determine active dropdown based on current URL
    if (location.pathname.startsWith("/sales")) {
      setActiveDropdown("sales");
    } else if (location.pathname.startsWith("/inventory")) {
      setActiveDropdown("inventory");
    } else if (location.pathname.startsWith("/reports")) {
      setActiveDropdown("reports");
    } else {
      setActiveDropdown(null); // Close all dropdowns if no match
    }
  }, [location.pathname]);

  const toggleDropdown = (dropdown) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");

    if (confirmLogout) {
      localStorage.removeItem("token");
      console.log("User logged out");

      navigate("/login");
    }
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <Link to="/dashboard">
          <img src={logo} alt="POS System Logo" className="sidebar-logo" />
        </Link>
      </div>

      <ul className="sidebar-menu">
        <li
          className={`sidebar-item ${
            location.pathname === "/dashboard" ? "active" : ""
          }`}
        >
          <Link to="/dashboard" className="sidebar-link">
            <FaTachometerAlt className="sidebar-icon" />
            <span className="sidebar-text">Dashboard</span>
          </Link>
        </li>

        <li className="sidebar-item" onClick={() => toggleDropdown("sales")}>
          <div className="sidebar-link">
            <FaShoppingCart className="sidebar-icon" />
            <span className="sidebar-text">Sales & Billing</span>
            <FaAngleDown
              className={`dropdown-icon ${
                activeDropdown === "sales" ? "open" : ""
              }`}
            />
          </div>
        </li>
        <ul
          className={`dropdown-menu ${
            activeDropdown === "sales" ? "active" : ""
          }`}
        >
          <li
            className={`sidebar-item ${
              location.pathname === "/sales/new-sale" ? "active" : ""
            }`}
          >
            <Link to="/sales/new-sale" className="sidebar-link">
              <FaShoppingCart className="sidebar-icon small-icon" />
              <span className="sidebar-text">New Sale</span>
            </Link>
          </li>
          <li
            className={`sidebar-item ${
              location.pathname === "/sales/invoices" ? "active" : ""
            }`}
          >
            <Link to="/sales/invoices" className="sidebar-link">
              <FaFileInvoice className="sidebar-icon small-icon" />
              <span className="sidebar-text">Invoices</span>
            </Link>
          </li>
        </ul>

        <li
          className="sidebar-item"
          onClick={() => toggleDropdown("inventory")}
        >
          <div className="sidebar-link">
            <FaBox className="sidebar-icon" />
            <span className="sidebar-text">Inventory</span>
            <FaAngleDown
              className={`dropdown-icon ${
                activeDropdown === "inventory" ? "open" : ""
              }`}
            />
          </div>
        </li>
        <ul
          className={`dropdown-menu ${
            activeDropdown === "inventory" ? "active" : ""
          }`}
        >
          <li
            className={`sidebar-item ${
              location.pathname === "/inventory/products" ? "active" : ""
            }`}
          >
            <Link to="/inventory/products" className="sidebar-link">
              <FaBoxes className="sidebar-icon small-icon" />
              <span className="sidebar-text">Products</span>
            </Link>
          </li>
          <li
            className={`sidebar-item ${
              location.pathname === "/inventory/category" ? "active" : ""
            }`}
          >
            <Link to="/inventory/category" className="sidebar-link">
              <FaThList className="sidebar-icon small-icon" />
              <span className="sidebar-text">Category</span>
            </Link>
          </li>
          <li
            className={`sidebar-item ${
              location.pathname === "/inventory/expired-products"
                ? "active"
                : ""
            }`}
          >
            <Link to="/inventory/expired-products" className="sidebar-link">
              <FaExclamationTriangle className="sidebar-icon small-icon" />
              <span className="sidebar-text">Expired Products</span>
            </Link>
          </li>
          <li
            className={`sidebar-item ${
              location.pathname === "/inventory/low-stock" ? "active" : ""
            }`}
          >
            <Link to="/inventory/low-stock" className="sidebar-link">
              <FaExclamationCircle className="sidebar-icon small-icon" />
              <span className="sidebar-text">Low Stock</span>
            </Link>
          </li>
        </ul>

        {/* <li
          className={`sidebar-item ${
            location.pathname === "/customers" ? "active" : ""
          }`}
        >
          <Link to="/customers" className="sidebar-link">
            <FaUsers className="sidebar-icon" />
            <span className="sidebar-text">Customers</span>
          </Link>
        </li> */}

        <li
          className={`sidebar-item ${
            location.pathname === "/price-checker" ? "active" : ""
          }`}
        >
          <Link to="/price-checker" className="sidebar-link">
            <FaTag className="sidebar-icon" /> {/* Price Tag Icon */}
            <span className="sidebar-text">Price Checker</span>
          </Link>
        </li>

        {/* <li
          className={`sidebar-item ${
            location.pathname === "/suppliers" ? "active" : ""
          }`}
        >
          <Link to="/suppliers" className="sidebar-link">
            <FaTruck className="sidebar-icon" />
            <span className="sidebar-text">Suppliers</span>
          </Link>
        </li> */}

        {/* Reports & Analytics Dropdown */}
        <li className="sidebar-item" onClick={() => toggleDropdown("reports")}>
          <div className="sidebar-link">
            <FaChartBar className="sidebar-icon" />
            <span className="sidebar-text">Reports & Analytics</span>
            <FaAngleDown
              className={`dropdown-icon ${
                activeDropdown === "reports" ? "open" : ""
              }`}
            />
          </div>
        </li>
        <ul
          className={`dropdown-menu ${
            activeDropdown === "reports" ? "active" : ""
          }`}
        >
          {/* Sales Reports */}
          {/* <li
            className={`sidebar-item ${
              location.pathname === "/reports/sales-reports" ? "active" : ""
            }`}
          >
            <Link to="/reports/sales-reports" className="sidebar-link">
              <FaChartLine className="sidebar-icon small-icon" />
              <span className="sidebar-text">Sales Reports</span>
            </Link>
          </li> */}

          {/* Invoice Reports */}
          <li
            className={`sidebar-item ${
              location.pathname === "/reports/invoice-reports" ? "active" : ""
            }`}
          >
            <Link to="/reports/invoice-reports" className="sidebar-link">
              <FaFileInvoiceDollar className="sidebar-icon small-icon" />
              <span className="sidebar-text">Invoice Reports</span>
            </Link>
          </li>
        </ul>

        <li
          className={`sidebar-item ${
            location.pathname === "/profile" ? "active" : ""
          }`}
        >
          <Link to="/profile" className="sidebar-link">
            <FaUserShield className="sidebar-icon" />
            <span className="sidebar-text">Profile</span>
          </Link>
        </li>
        {/* <li
          className={`sidebar-item ${
            location.pathname === "/settings" ? "active" : ""
          }`}
        >
          <Link to="/settings" className="sidebar-link">
            <FaCog className="sidebar-icon" />
            <span className="sidebar-text">Settings</span>
          </Link>
        </li> */}
      </ul>
      <li className="sidebar-item sidebar-logout" onClick={handleLogout}>
        <div className="sidebar-link">
          <FaSignOutAlt className="sidebar-icon logout-sidebar-icon" />
          <span className="sidebar-text">Logout</span>
        </div>
      </li>
    </div>
  );
};

export default Sidebar;

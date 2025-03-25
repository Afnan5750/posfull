import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { FaInfoCircle } from "react-icons/fa";
import Sidebar from "./components/Sidebar/Sidebar";
import Newsale from "./Pages/NewSale";
import Product from "./Pages/Product";
import Invoice from "./Pages/Invoice";
import Category from "./Pages/Category";
import ExpiredPro from "./Pages/ExpiredPro";
import PriceChecker from "./Pages/PriceChecker";
import LowStock from "./Pages/LowStock";
import InvoiceReport from "./Pages/InvoiceReport";
import Profile from "./Pages/Profile";
import Dashboard from "./Pages/Dashboard";
import Login from "./components/Login/Login";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import Hint from "./components/Hint/Hint";
import Calculator from "./components/Calculator/Calculator";
import { Tooltip } from "react-tooltip";
import "./App.css";
import Detail from "./components/DetailPage/Detail";

const Layout = ({ children }) => {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  return (
    <div className="app-container">
      {!isLoginPage && <Sidebar />}
      <div className="content">{children}</div>

      <div className="hint-icon-container" data-tooltip-id="hintTooltip">
        <FaInfoCircle className="hint-icon" />
        <Tooltip id="hintTooltip" place="top" effect="solid">
          Press <span style={{ fontWeight: "bold" }}> Ctrl + Shift + H</span>{" "}
          for Keyboard Shortcuts
        </Tooltip>
      </div>
    </div>
  );
};

const App = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.shiftKey && e.key.toLowerCase() === "i") {
        e.preventDefault();
        navigate("/sales/invoices");
      }
      if (e.shiftKey && e.key.toLowerCase() === "d") {
        e.preventDefault();
        navigate("/dashboard");
      }
      if (e.shiftKey && e.key.toLowerCase() === "n") {
        e.preventDefault();
        navigate("/sales/new-sale");
      }
      if (e.shiftKey && e.key.toLowerCase() === "p") {
        e.preventDefault();
        navigate("/inventory/products");
      }
      if (e.shiftKey && e.key.toLowerCase() === "c") {
        e.preventDefault();
        navigate("/inventory/category");
      }
      if (e.shiftKey && e.key.toLowerCase() === "e") {
        e.preventDefault();
        navigate("/inventory/expired-products");
      }
      if (e.shiftKey && e.key.toLowerCase() === "l") {
        e.preventDefault();
        navigate("/inventory/low-stock");
      }
      if (e.altKey && e.key.toLowerCase() === "p") {
        e.preventDefault();
        navigate("/price-checker");
      }
      if (e.altKey && e.key.toLowerCase() === "i") {
        e.preventDefault();
        navigate("/reports/invoice-reports");
      }
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "p") {
        e.preventDefault();
        navigate("/profile");
      }
      if (e.ctrlKey && e.key.toLowerCase() === "l") {
        e.preventDefault();
        handleLogout();
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [navigate]);

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  return (
    <>
      <Hint />
      <Calculator />
      <Routes>
        {/* public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Login />} />
        <Route path="/detail" element={<Detail />} />

        {/* private routes */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <Layout>
                <Routes>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/sales/new-sale" element={<Newsale />} />
                  <Route path="/sales/invoices" element={<Invoice />} />
                  <Route
                    path="/reports/invoice-reports"
                    element={<InvoiceReport />}
                  />
                  <Route path="/inventory/products" element={<Product />} />
                  <Route path="/inventory/category" element={<Category />} />
                  <Route
                    path="/inventory/expired-products"
                    element={<ExpiredPro />}
                  />
                  <Route path="/price-checker" element={<PriceChecker />} />
                  <Route path="/inventory/low-stock" element={<LowStock />} />
                  <Route
                    path="/sales/newsale/:invoiceId"
                    element={<Newsale />}
                  />
                  <Route path="/profile" element={<Profile />} />
                </Routes>
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
};

const AppWrapper = () => (
  <Router>
    <App />
  </Router>
);

export default AppWrapper;

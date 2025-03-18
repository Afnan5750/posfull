import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
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
import Login from "./components/Login/Login";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import Hint from "./components/Hint/Hint";
import "./App.css";
import Calculator from "./components/Calculator/Calculator";

const Layout = ({ children }) => {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login"; // Hide sidebar on login page

  return (
    <div className="app-container">
      {!isLoginPage && <Sidebar />}
      <div className="content">{children}</div>
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
      if (e.key.toLowerCase() === "f") {
        e.preventDefault();
        toggleFullScreen();
      }
    };

    const toggleFullScreen = () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch((err) => {
          console.error("Error attempting to enable fullscreen:", err.message);
        });
      } else {
        document.exitFullscreen();
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [navigate]);

  return (
    <>
      <Hint />
      <Calculator />
      <Routes>
        {/* public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Login />} />

        {/* private routes */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <Layout>
                <Routes>
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

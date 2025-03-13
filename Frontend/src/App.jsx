import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
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
import "./App.css";

const Layout = ({ children }) => {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login"; // Check if on login page

  return (
    <div className="app-container">
      {!isLoginPage && <Sidebar />} {/* Hide sidebar on login page */}
      <div className="content">{children}</div>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/*"
          element={
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
                <Route path="/sales/newsale/:invoiceId" element={<Newsale />} />
                <Route path="/profile" element={<Profile />} />
              </Routes>
            </Layout>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;

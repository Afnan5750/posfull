import React from "react";
import Sidebar from "./components/Sidebar/Sidebar";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Newsale from "./Pages/NewSale";
import "./App.css";
import Product from "./Pages/Product";
import Invoice from "./Pages/Invoice";
import Category from "./Pages/Category";
import ExpiredPro from "./Pages/ExpiredPro";
import PriceChecker from "./Pages/PriceChecker";
import LowStock from "./Pages/LowStock";
import InvoiceReport from "./Pages/InvoiceReport";

const App = () => {
  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        <div className="content">
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
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;

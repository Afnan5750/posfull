import React, { useState } from "react";
import DataTable from "react-data-table-component";
import "../Styles/ExpiredPro.css";

const ExpiredPro = () => {
  const [searchText, setSearchText] = useState("");
  const [data, setData] = useState([
    {
      product_id: 1,
      name: "Milk",
      category: "Dairy",
      expiry_date: "2024-07-01",
    },
    {
      product_id: 2,
      name: "Bread",
      category: "Bakery",
      expiry_date: "2024-06-28",
    },
    {
      product_id: 3,
      name: "Eggs",
      category: "Grocery",
      expiry_date: "2024-07-05",
    },
    {
      product_id: 4,
      name: "Juice",
      category: "Beverages",
      expiry_date: "2024-06-30",
    },
  ]);

  const columns = [
    { name: "Product ID", selector: (row) => row.product_id, sortable: true },
    { name: "Product Name", selector: (row) => row.name, sortable: true },
    { name: "Category", selector: (row) => row.category, sortable: true },
    { name: "Expiry Date", selector: (row) => row.expiry_date, sortable: true },
  ];

  const filteredData = data.filter(
    (item) =>
      item.name.toLowerCase().includes(searchText.toLowerCase()) ||
      item.product_id.toString().includes(searchText)
  );

  return (
    <div className="expired-product-table-container full-width">
      <h2 className="table-title">Expired Product Table</h2>

      {/* Only Search Box Aligned to the Right */}
      <div className="table-controls-right">
        <input
          type="text"
          placeholder="Search expired product..."
          className="search-box"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>

      <DataTable
        columns={columns}
        data={filteredData}
        pagination
        highlightOnHover
      />
    </div>
  );
};

export default ExpiredPro;

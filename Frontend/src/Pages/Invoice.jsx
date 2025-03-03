import React, { useState } from "react";
import DataTable from "react-data-table-component";
import "../Styles/Invoice.css"; // Import CSS file

const Invoice = () => {
  const [searchText, setSearchText] = useState("");

  const data = [
    {
      invoice_id: 1,
      customer: "John Doe",
      date: "2024-02-25",
      amount: "$1200",
    },
    {
      invoice_id: 2,
      customer: "Alice Smith",
      date: "2024-02-26",
      amount: "$900",
    },
    {
      invoice_id: 3,
      customer: "Michael Brown",
      date: "2024-02-27",
      amount: "$1500",
    },
    {
      invoice_id: 4,
      customer: "Emily White",
      date: "2024-02-28",
      amount: "$1100",
    },
  ];

  const columns = [
    { name: "Invoice ID", selector: (row) => row.invoice_id, sortable: true },
    { name: "Customer Name", selector: (row) => row.customer, sortable: true },
    { name: "Invoice Date", selector: (row) => row.date, sortable: true },
    { name: "Amount", selector: (row) => row.amount, sortable: true },
  ];

  // Filter Data Based on Search Input
  const filteredData = data.filter(
    (item) =>
      item.customer.toLowerCase().includes(searchText.toLowerCase()) ||
      item.invoice_id.toString().includes(searchText)
  );

  return (
    <div className="invoice-container full-width">
      <h2 className="table-title">Invoice Table</h2>

      {/* Centered Search Box */}
      <div className="invoice-search">
        <input
          type="text"
          placeholder="Search invoice..."
          className="invoice-search-box"
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

export default Invoice;

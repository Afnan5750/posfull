import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa"; // Import icons
import "../Styles/Product.css";

const Product = () => {
  const [searchText, setSearchText] = useState("");
  const [data, setData] = useState([]);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/product/getproducts"
        );
        setData(response.data.products);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  // Handle Edit Action
  const onEdit = (product) => {
    console.log("Edit clicked for:", product);
    // You can open a modal here for editing
  };

  // Handle Delete Action
  const onDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(
          `http://localhost:5000/api/product/deleteproduct/${id}`
        );
        setData(data.filter((product) => product._id !== id));
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  const columns = [
    { name: "Barcode", selector: (row) => row.Probarcode, sortable: true },
    {
      name: "Product Name",
      selector: (row) => row.ProductName,
      sortable: true,
    },
    { name: "Category", selector: (row) => row.Category, sortable: true },
    {
      name: "Cost Price",
      selector: (row) => `Rs. ${row.CostPrice}`,
      sortable: true,
    },
    {
      name: "Retail Price",
      selector: (row) => `Rs. ${row.RetailPrice}`,
      sortable: true,
    },
    { name: "Unit", selector: (row) => row.Unit, sortable: true },
    { name: "Quantity", selector: (row) => row.Quantity, sortable: true },
    {
      name: "Image",
      cell: (row) => (
        <img
          src={`http://localhost:5000/uploads/${row.ProImage}`} // Adjust your image URL path
          alt={row.ProductName}
          style={{ width: "75px", height: "75px", borderRadius: "5px" }}
        />
      ),
      ignoreRowClick: true,
      sortable: false,
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="action-buttons">
          <button className="edit-btn" onClick={() => onEdit(row)}>
            <FaEdit />
          </button>
          <button className="delete-btn" onClick={() => onDelete(row._id)}>
            <FaTrash />
          </button>
        </div>
      ),
      ignoreRowClick: true,
    },
  ];

  // Filter data based on search input
  const filteredData = data.filter(
    (item) =>
      item.ProductName?.toLowerCase().includes(searchText.toLowerCase()) ||
      item.Probarcode?.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="product-table-container full-width">
      <h2 className="table-title">Product Table</h2>

      <div className="table-controls">
        <button className="add-button">Add Product</button>
        <input
          type="text"
          placeholder="Search product..."
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

export default Product;

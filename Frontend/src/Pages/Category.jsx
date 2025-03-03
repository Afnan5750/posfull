import React, { useState } from "react";
import DataTable from "react-data-table-component";
import "../Styles/Category.css";

const Category = () => {
  const [searchText, setSearchText] = useState("");
  const [data, setData] = useState([
    {
      category_id: 1,
      name: "Electronics",
      description: "Electronic gadgets and devices",
    },
    {
      category_id: 2,
      name: "Furniture",
      description: "Home and office furniture",
    },
    { category_id: 3, name: "Clothing", description: "Men and Women clothing" },
    {
      category_id: 4,
      name: "Books",
      description: "Educational and fiction books",
    },
  ]);

  const columns = [
    { name: "Category ID", selector: (row) => row.category_id, sortable: true },
    { name: "Category Name", selector: (row) => row.name, sortable: true },
    { name: "Description", selector: (row) => row.description, sortable: true },
  ];

  const filteredData = data.filter(
    (item) =>
      item.name.toLowerCase().includes(searchText.toLowerCase()) ||
      item.category_id.toString().includes(searchText)
  );

  return (
    <div className="category-table-container full-width">
      <h2 className="table-title">Category Table</h2>

      <div className="table-controls">
        <button className="add-button">Add Category</button>
        <input
          type="text"
          placeholder="Search category..."
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

export default Category;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DataTable from "react-data-table-component";
import "../Styles/Invoice.css";
import { FaEye, FaEdit, FaTrash, FaPrint } from "react-icons/fa";

const Invoice = () => {
  const [searchText, setSearchText] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/invoice/getinvoices"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch invoices");
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  const handleEditClick = (invoiceId) => {
    navigate(`/sales/newsale/${invoiceId}`);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this invoice?")) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/invoice/deleteinvoice/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete invoice");
      }

      setData((prevData) => prevData.filter((invoice) => invoice._id !== id));
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  // Function to highlight search text in matching words
  const highlightText = (text, searchText) => {
    if (!searchText || !text) return text; // If no search or text is undefined, return normal text

    const regex = new RegExp(`(${searchText})`, "gi"); // Case-insensitive search
    return String(text).replace(regex, `<span class="highlight">$1</span>`);
  };

  const columns = [
    {
      name: "Invoice No",
      selector: (row) => (
        <span
          dangerouslySetInnerHTML={{
            __html: highlightText(row.invoiceNo || "", searchText),
          }}
        />
      ),
      sortable: true,
    },
    {
      name: "Date",
      selector: (row) => {
        const date = new Date(row.createdAt);
        return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
      },
      sortable: true,
    },
    {
      name: "Customer Name",
      selector: (row) => (
        <span
          dangerouslySetInnerHTML={{
            __html: highlightText(row.customerName || "", searchText),
          }}
        />
      ),
      sortable: true,
    },
    {
      name: "Customer Contact No",
      selector: (row) => row.customerContactNo,
      sortable: true,
    },
    {
      name: "Total Amount",
      selector: (row) => `Rs. ${row.totalAmount}`,
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="action-buttons">
          <button
            className="view-btn"
            onClick={() => {
              setSelectedInvoice(row);
              setIsModalOpen(true);
            }}
          >
            <FaEye />
          </button>

          <button className="edit-btn" onClick={() => handleEditClick(row._id)}>
            <FaEdit />
          </button>
          <button className="print-btn">
            <FaPrint />
          </button>
          <button className="delete-btn" onClick={() => handleDelete(row._id)}>
            <FaTrash />
          </button>
        </div>
      ),
      ignoreRowClick: true,
    },
  ];

  // Keyboard Shortcuts
  const handleKeyPress = (e) => {
    if (e.key === "Escape" && isModalOpen) {
      setIsModalOpen(false); // Close the modal when Escape is pressed
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [isModalOpen]);

  return (
    <div className="invoice-container full-width">
      <h2 className="table-title">Invoice Table</h2>

      <div className="invoice-search">
        <input
          type="text"
          placeholder="Search invoice..."
          className="invoice-search-box"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>

      {loading ? (
        <p>Loading invoices...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : (
        <DataTable
          columns={columns}
          data={data.filter(
            (item) =>
              item.customerName
                .toLowerCase()
                .includes(searchText.toLowerCase()) ||
              item.invoiceNo.toString().includes(searchText) ||
              item.customerContactNo.toString().includes(searchText)
          )}
          pagination
          highlightOnHover
        />
      )}

      {isModalOpen && selectedInvoice && (
        <div className="modal-overlay custom-modal-overlay">
          <div className="modal-content custom-modal-content">
            <span
              className="modal-close custom-modal-close"
              onClick={() => setIsModalOpen(false)}
            >
              &times;
            </span>

            {/* Invoice Header */}
            <div className="custom-invoice-header custom-text-center">
              <h2>Company Name</h2>
              <p>123 Main Street, City, Country</p>
              <p>Email: info@company.com | Phone: (123) 456-7890</p>
            </div>

            <hr className="custom-divider" />

            {/* Invoice Details */}
            <div className="custom-invoice-details">
              <div className="custom-invoice-flex">
                <p>
                  <strong>Invoice No:</strong> {selectedInvoice.invoiceNo}
                </p>
                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(selectedInvoice.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="custom-invoice-flex">
                <p>
                  <strong>Customer Name:</strong> {selectedInvoice.customerName}
                </p>
                <p>
                  <strong>Contact No:</strong>{" "}
                  {selectedInvoice.customerContactNo}
                </p>
              </div>
            </div>

            <hr className="custom-divider" />

            {/* Invoice Items Table */}
            <table className="custom-invoice-table">
              <thead>
                <tr className="custom-table-header">
                  <th className="custom-table-th">#</th>
                  <th className="custom-table-th">Product Name</th>
                  <th className="custom-table-th">Quantity</th>
                  <th className="custom-table-th">Price</th>
                  <th className="custom-table-th">Total</th>
                </tr>
              </thead>
              <tbody>
                {selectedInvoice.items?.map((item, index) => {
                  const RetailPrice = item.RetailPrice || 0;
                  return (
                    <tr key={index} className="custom-table-row">
                      <td className="custom-table-td">{index + 1}</td>
                      <td className="custom-table-td">
                        {item.ProductName || "N/A"}
                      </td>
                      <td className="custom-table-td">{item.Quantity || 0}</td>
                      <td className="custom-table-td">
                        Rs. {Number(RetailPrice).toFixed(2)}
                      </td>
                      <td className="custom-table-td">
                        Rs.{" "}
                        {(
                          Number(item.Quantity || 0) * Number(RetailPrice)
                        ).toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Total Amount */}
            <div className="custom-invoice-total custom-text-right">
              <h3>
                Total: Rs. {selectedInvoice.totalAmount?.toFixed(2) || "0.00"}
              </h3>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Invoice;

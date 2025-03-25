import React, { useState } from "react";
import axios from "axios";
import "./Detail.css";

const Detail = () => {
  const [storeName, setStoreName] = useState("");
  const [logo, setLogo] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [message, setMessage] = useState("");
  // const [warning] = useState(
  //   "⚠️ Once saved, you cannot change the store name and logo."
  // );

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogo(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    if (!storeName || !logo) {
      setMessage("Please enter a store name and upload an image.");
      return;
    }

    const isConfirmed = window.confirm(
      "Are you sure you want to save store details?"
    );
    if (!isConfirmed) return;

    const formData = new FormData();
    formData.append("storeName", storeName);
    formData.append("logo", logo);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/Detail/addDetail",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setMessage(response.data.message);
      setStoreName("");
      setLogo(null);
      setImagePreview(null);
    } catch (error) {
      setMessage("Error saving store details. Please try again.");
    }
  };

  return (
    <div className="detail-container">
      <h2 className="detail-tagline">Set Your Store Name & Logo</h2>

      {/* <p className="warning-message">{warning}</p> */}

      <div className="detail-input-group">
        <label className="detail-label" htmlFor="storeName">
          Store Name:
        </label>
        <input
          type="text"
          id="storeName"
          className="detail-input"
          placeholder="Enter store name"
          value={storeName}
          onChange={(e) => setStoreName(e.target.value)}
        />
      </div>

      <div className="detail-input-group">
        <label className="detail-label" htmlFor="storeImage">
          Upload Image:
        </label>
        <input
          type="file"
          id="storeImage"
          className="detail-file-input"
          accept="image/*"
          onChange={handleImageChange}
        />
      </div>

      {message && <p className="success-message">{message}</p>}

      {imagePreview && (
        <div className="image-preview">
          <img src={imagePreview} alt="Preview" className="preview-img" />
        </div>
      )}

      <div className="detail-actions">
        <button className="detail-save-btn" onClick={handleSave}>
          Save
        </button>
      </div>
    </div>
  );
};

export default Detail;

import { useState, useEffect } from "react";
import "../Styles/Profile.css";
import profileImage from "../assets/images/black-pos-logo.png";
import axios from "axios";

const Profile = () => {
  const [userDetails, setUserDetails] = useState({
    username: "",
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found");
          return;
        }

        const response = await axios.get(
          "http://localhost:5000/api/auth/getuser",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.data) {
          setUserDetails((prevDetails) => ({
            ...prevDetails,
            username: response.data.username,
          }));
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, []);

  const handleChange = (e) => {
    setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (
      !userDetails.oldPassword ||
      !userDetails.newPassword ||
      !userDetails.confirmPassword
    ) {
      setError("All password fields are required.");
      clearMessages();
      return;
    }

    if (userDetails.newPassword !== userDetails.confirmPassword) {
      setError("New password and confirm password do not match.");
      clearMessages();
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication error. Please log in again.");
        clearMessages();
        return;
      }

      const response = await axios.put(
        "http://localhost:5000/api/auth/updateuser",
        {
          username: userDetails.username,
          oldPassword: userDetails.oldPassword,
          password: userDetails.newPassword,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.message === "User updated successfully") {
        setError("");
        setSuccess("Password updated successfully.");
        setEditing(false);
        setUserDetails({
          ...userDetails,
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        });

        clearMessages(); // ✅ Remove success message after 5s
      }
    } catch (error) {
      setSuccess("");
      setError(error.response?.data?.message || "Error updating password.");
      clearMessages(); // ✅ Remove error message after 5s
    }
  };

  // Function to clear messages after 5 seconds
  const clearMessages = () => {
    setTimeout(() => {
      setError("");
      setSuccess("");
    }, 5000);
  };

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.ctrlKey) {
        e.preventDefault(); // Prevent default browser behavior

        if (e.key.toLowerCase() === "e") {
          setEditing((prevEditing) => !prevEditing); // Toggle edit mode
        } else if (e.key.toLowerCase() === "s" && editing) {
          handleSave(); // Trigger Save when editing
        } else if (e.key.toLowerCase() === "c" && editing) {
          setEditing(false); // Cancel editing
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [editing, handleSave]);

  return (
    <div className="profile-container">
      <h2 className="profile-heading">Profile</h2>

      <div className="profile-image-wrapper">
        <img src={profileImage} alt="Profile" className="profile-image" />
      </div>

      <div className="profile-info-container">
        <div className="profile-input-group">
          <label className="profile-label">Username</label>
          <input
            type="text"
            name="username"
            value={userDetails.username}
            className="profile-input"
            disabled
          />
        </div>

        {editing &&
          ["oldPassword", "newPassword", "confirmPassword"].map((field) => (
            <div key={field} className="profile-input-group">
              <label className="profile-label">
                {field.replace(/([A-Z])/g, " $1").trim()}
              </label>
              <input
                type="password"
                name={field}
                value={userDetails[field]}
                className="profile-input"
                onChange={handleChange}
              />
            </div>
          ))}
      </div>

      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}

      <div className="profile-actions">
        <button
          className="profile-edit-btn"
          onClick={() => setEditing(!editing)}
        >
          {editing ? "Cancel" : "Edit"}
        </button>
        {editing && (
          <button className="save-btn" onClick={handleSave}>
            Save
          </button>
        )}
      </div>
    </div>
  );
};

export default Profile;

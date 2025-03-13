import { useState } from "react";
import "../Styles/Profile.css";
import profileImage from "../assets/images/black-pos-logo.png";

const Profile = () => {
  const [userDetails, setUserDetails] = useState({
    username: "Afnan",
    email: "mafnankhadim74@gmail.com",
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [editing, setEditing] = useState(false);

  const handleChange = (e) => {
    setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
  };

  return (
    <div className="profile-container">
      <h2 className="profile-heading">Profile</h2>

      <div className="profile-image-wrapper">
        <img src={profileImage} alt="Profile" className="profile-image" />
      </div>

      <div className="profile-info-container">
        <div className="profile-flex">
          <div className="profile-input-group">
            <label className="profile-label">Username</label>
            <input
              type="text"
              name="username"
              value={userDetails.username}
              className="profile-input"
              disabled={true}
              onChange={handleChange}
            />
          </div>

          <div className="profile-input-group">
            <label className="profile-label">Email</label>
            <input
              type="email"
              name="email"
              value={userDetails.email}
              className="profile-input"
              disabled={true}
              onChange={handleChange}
            />
          </div>
        </div>

        {editing && (
          <>
            <div className="profile-input-group">
              <label className="profile-label">Old Password</label>
              <input
                type="password"
                name="oldPassword"
                value={userDetails.oldPassword}
                className="profile-input"
                onChange={handleChange}
              />
            </div>

            <div className="profile-input-group">
              <label className="profile-label">New Password</label>
              <input
                type="password"
                name="newPassword"
                value={userDetails.newPassword}
                className="profile-input"
                onChange={handleChange}
              />
            </div>

            <div className="profile-input-group">
              <label className="profile-label">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={userDetails.confirmPassword}
                className="profile-input"
                onChange={handleChange}
              />
            </div>
          </>
        )}
      </div>

      <div className="profile-actions">
        <button
          className="profile-edit-btn"
          onClick={() => setEditing(!editing)}
        >
          {editing ? "Cancel" : "Edit"}
        </button>
        {editing && <button className="save-btn">Save</button>}
      </div>
    </div>
  );
};

export default Profile;

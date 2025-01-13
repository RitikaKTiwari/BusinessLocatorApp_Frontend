import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Logout.css";

const Logout = ({ onClose }) => {
  const [showLogoutBox, setShowLogoutBox] = useState(true);
  const navigate = useNavigate();

  const handleLogout = () => {
    console.log("Logged out");
    localStorage.clear(); // Clear local storage
    setShowLogoutBox(false);
    navigate("/Login"); // Redirect to Login
    onClose(); // Notify parent to close the dialog
  };

  const closeLogoutBox = () => {
    setShowLogoutBox(false);
    onClose(); // Notify parent to close the dialog
  };

  return (
    <>
      {showLogoutBox && (
        <div className="logout-overlay">
          <div className="logout-box">
            <h3>Confirm Logout</h3>
            <p>Are you sure you want to log out?</p>
            <div className="logout-actions">
              <button className="confirm-button" onClick={handleLogout}>
                Yes, Logout
              </button>
              <button className="cancel-button" onClick={closeLogoutBox}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Logout;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ChangePassword from "./ChangePassword";
import "../../UserProfileManagement/UserSettings/PrivacySecurity.css";
import Header from "../../../Header/Header";
import Footer from "../../../Footer/Footer";
import { IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const PrivacySecurity = () => {
  const navigate = useNavigate();
  const [changePasswordDialogOpen, setChangePasswordDialogOpen] =
    useState(false);

  const openDialog = () => {
    setChangePasswordDialogOpen(true);
  };

  const closeDialog = () => {
    setChangePasswordDialogOpen(false);
  };

  return (
    <>
      <header>
        <Header></Header>
      </header>
      <div className="privacy-security-page">
      <div style={{marginLeft:300}}>
            <IconButton
              onClick={() => {
                navigate(-1);

              }}
              aria-label="back"
            >
              <ArrowBackIcon />
            </IconButton>
          </div>
        <header className="privacy-header">
          <h1>Privacy & Security</h1>
          <p>Manage your account settings, address, and password securely.</p>
        </header>

        <div className="privacy-content">
          {/* Address Section */}
          <div
            className="privacy-section card"
            onClick={() => navigate("/ViewAndUpdateBusinessAddress")}
          >
            <h2>Manage Your Address</h2>
            <p>Update and review your saved address.</p>
          </div>

          {/* Password Section */}
          <div className="privacy-section card" onClick={openDialog}>
            <h2>Change Your Password</h2>
            <p>Ensure your account security with a strong password.</p>
          </div>
        </div>
        {changePasswordDialogOpen && <ChangePassword onClose={closeDialog} />}
        
      </div>
      <footer>
          <Footer></Footer>
        </footer>
    </>
  );
};

export default PrivacySecurity;

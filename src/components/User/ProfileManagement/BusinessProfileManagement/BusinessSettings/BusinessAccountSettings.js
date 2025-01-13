import React, { useState } from "react";
import "../../UserProfileManagement/UserSettings/AccountSettings.css";
import Logout from "../../Logout";
import DeleteAccount from "../../DeleteAccount";
import { useNavigate } from "react-router-dom";
import Header from "../../../Header/Header";
import Footer from "../../../Footer/Footer";
import { IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const BusinessAccountSettings = () => {
  const navigate = useNavigate();
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [deleteDialogOpen, setdeleteDialogOpen] = useState(false);

  const openLogoutDialog = () => {
    setLogoutDialogOpen(true);
  };

  const closeLogoutDialog = () => {
    setLogoutDialogOpen(false);
  };

  const openDeleteDialog = () => {
    setdeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setdeleteDialogOpen(false);
  };

  return (
    <>
      <header>
        <Header></Header>
      </header>

      <div className="account-settings-page">
        <div style={{ marginLeft: 100 }}>
          <IconButton
            onClick={() => {
              navigate(-1);
            }}
            aria-label="back"
          >
            <ArrowBackIcon />
          </IconButton>
        </div>
        <header className="settings-header">
          <h1>Account Settings</h1>
          <p>
            Manage your account by adding or deleting accounts and logging out
            securely.
          </p>
        </header>

        <div className="settings-content">
          {/* Add Account Section */}
          <div
            className="settings-section card"
            onClick={() => navigate("/BusinessRegistration")}
          >
            <h2>Add Account</h2>
            <p>Create a new account to start using the app.</p>
          </div>

          {/* Delete Account Section */}
          <div className="settings-section card" onClick={openDeleteDialog}>
            <h2>Delete Account</h2>
            <p>Remove an existing account from the application.</p>
          </div>

          {/* Logout Section */}
          <div className="settings-section card" onClick={openLogoutDialog}>
            <h2>Logout</h2>
            <p>Securely log out from the current session.</p>
          </div>
        </div>
        {logoutDialogOpen && <Logout onClose={closeLogoutDialog} />}
        {deleteDialogOpen && <DeleteAccount onClose={closeDeleteDialog} />}
        <footer>
          <Footer></Footer>
        </footer>
      </div>
    </>
  );
};

export default BusinessAccountSettings;

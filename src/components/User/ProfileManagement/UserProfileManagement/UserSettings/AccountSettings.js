
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logout from '../../Logout';
import './AccountSettings.css';
import DeleteAccount from '../../DeleteAccount';
import Header from '../../../Header/Header';
import Footer from '../../../Footer/Footer';
import { IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const AccountSettings = () => {
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
    <div className="account-settings-page">
      <header className="settings-header">
        <div><Header></Header></div>
        
        <h1>Account Settings</h1>
        
        <p>Manage your account by adding or deleting accounts and logging out securely.</p>
      </header>
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
      <div className="settings-content">
            <div
          className="settings-section card"
          onClick={() => navigate('/UserRegistration')}
        >
          <h2>Add Account</h2>
          <p>Create a new account to start using the app.</p>
        </div>

        {/* Delete Account Section */}
        <div
          className="settings-section card"
          onClick={openDeleteDialog}
        >
          <h2>Delete Account</h2>
          <p>Remove an existing account from the application.</p>
        </div>

        {/* Logout Section */}
        <div
          className="settings-section card"
          onClick={openLogoutDialog}
        >
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
  );
};

export default AccountSettings;
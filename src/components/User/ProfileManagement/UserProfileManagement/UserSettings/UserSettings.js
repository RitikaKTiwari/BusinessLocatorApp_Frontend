import React, { useState } from "react";
import "./UserSettings.css";
import account from "../../../../image/account.mp4";
import contact from "../../../../image/customer-service.png";
import setting from "../../../../image/setting.mp4";
import booked from "../../../../image/booked-service.png";
import { useNavigate } from "react-router-dom";
import Header from "../../../Header/Header";
import Footer from "../../../Footer/Footer";
import { IconButton, Dialog } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ContactUs from "../../../ContactUs/ContactUs"; 

const UserSettings = () => {
  const navigate = useNavigate();
  const [isContactDialogOpen, setContactDialogOpen] = useState(false);

  function settclick() {
    navigate("/AccountSettings");
  }

  function viewclick() {
    navigate("/PrivacyAndSecurity");
  }

  function bookClick() {
    navigate("/ViewMyAppointment");
  }

  // Toggle dialog open/close
  function openContactDialog() {
    setContactDialogOpen(true);
  }

  function closeContactDialog() {
    setContactDialogOpen(false);
  }

  return (
    <>
      <Header />
      <title>Your Account</title>
      <body>
        <div className="set-container">
          <div style={{ marginLeft: 200 }}>
            <IconButton
              onClick={() => {
                navigate(-1);
              }}
              aria-label="back"
            >
              <ArrowBackIcon />
            </IconButton>
          </div>
          <h1 className="set-h1">Your Account</h1>
          <div className="set-account-grid">
            <div className="set-account-item" onClick={settclick}>
              <video width={70} height={70} src={setting} alt="Setting" />
              <h2>Account Settings</h2>
              <p>Add account, Delete account, logout</p>
            </div>
            <div className="set-account-item" onClick={viewclick}>
              <video width={70} height={70} src={account} alt="Privacy & Security" />
              <h2>Privacy & security</h2>
              <p>Manage your addresses and password</p>
            </div>
            <div className="set-account-item" onClick={bookClick}>
              <img width={70} height={70} src={booked} alt="Booked Services" />
              <h2>Booked Services</h2>
              <p>View your previously booked services</p>
            </div>
            <div className="set-account-item" onClick={openContactDialog}>
              <img width={70} height={70} src={contact} alt="Contact Us" />
              <h2>Contact Us</h2>
              <p>Get help with your orders and more</p>
            </div>
          </div>
        </div>

        <Dialog
          open={isContactDialogOpen}
          onClose={closeContactDialog}
          maxWidth="md"
          fullWidth
        >
          <ContactUs closePopup={closeContactDialog} /> {/* Pass closePopup */}
        </Dialog>
      </body>
      <Footer />
    </>
  );
};

export default UserSettings;
import React, { useState } from "react";
import "./Footer.css";
import { useNavigate } from "react-router-dom";
import ContactUs from "../ContactUs/ContactUs"; // Import the ContactUs component

const Footer = () => {
  const [showContactPopup, setShowContactPopup] = useState(false); // State for managing popup visibility
  const navigate = useNavigate();

  const conclick = () => {
    setShowContactPopup(true); // Show the Contact Us popup
  };

  const aboutclick = () => {
    navigate("/AboutUs");
  };

  const resellclick = () => {
    navigate("/ReSell");
  };

  const rentclick = () => {
    navigate("/Rent");
  };

  const privacyPolicyClick = () => {
    navigate("/PrivacyPolicy"); 
  };

  const closePopup = () => {
    setShowContactPopup(false); // Close the popup
  };

  return (
    <div className="foot-box">
      <div className="FooterContainer">
        <div className="Row-foot">
          <div className="Column-foot">
            <div className="Heading">About Us</div>
            <span onClick={aboutclick} className="FooterLink">
              Who We Are
            </span>
            <span onClick={conclick} className="FooterLink">
              Contact Us
            </span>
          </div>
          <div className="Column">
            <div className="Heading">Services</div>
            <span className="FooterLink" onClick={resellclick}>
              Book your Appointment
            </span>
            <span className="FooterLink" onClick={rentclick}>
              Search for services
            </span>
          </div>
          <div className="Column">
            <div className="Heading">Follow Us</div>
            <a className="FooterLink" href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer">
              Instagram
            </a>
            <a className="FooterLink" href="https://www.youtube.com/" target="_blank" rel="noopener noreferrer">
              YouTube
            </a>
            <a className="FooterLink" href="https://twitter.com/?lang=en" target="_blank" rel="noopener noreferrer">
              Twitter
            </a>
          </div>
          <div className="Column">
            <div className="Heading">Privacy & Legal</div>
            <span onClick={privacyPolicyClick} className="FooterLink">
              Privacy Policy
            </span>
          </div>
        </div>
      </div>

      {/* Darkened background and popup */}
      {showContactPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <button className="close-popup" onClick={closePopup}>X</button>
            <ContactUs closePopup={closePopup} /> {/* Pass closePopup function as a prop */}
          </div>
        </div>
      )}

<div class="footer-bottom">
    <p>© 2024 Business Locator. All rights reserved.</p>
  </div>
    </div>
  );
};

export default Footer;

import React from "react";
import { useNavigate } from "react-router-dom";
import "./AboutUs.css"; // Import the CSS file for styling
import Header from "../Header/Header"; // Import Header component
import Footer from "../Footer/Footer"; // Import Footer component
import { IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const AboutUs = () => {
  const navigate = useNavigate();
  return (
    <div>
      <Header /> {/* Add Header at the top */}
      <div className="about-us-container">
        <div className="about-us-content">
          <div>
            <IconButton
              onClick={() => {
                navigate(-1);
              }}
              aria-label="back"
            >
              <ArrowBackIcon />
            </IconButton>
          </div>
          <h1 className="about-us-title">About Us</h1>
          <p className="about-us-description">
            Welcome to the Business Locator App! We are here to connect
            businesses with users seeking their services. Our platform helps
            users discover nearby businesses based on their needs and allows
            business owners to manage and promote their services effectively.
          </p>

          <section className="about-us-section">
            <h2 className="about-us-subtitle">Our Mission</h2>
            <p className="about-us-text">
              Our mission is to make business discovery seamless and convenient
              for users while providing businesses with the tools they need to
              manage their services and grow their customer base.
            </p>
          </section>

          <section className="about-us-section">
            <h2 className="about-us-subtitle">What We Offer</h2>
            <ul className="about-us-list">
              <li className="about-us-list-item">
                Easy access to nearby businesses and services.
              </li>
              <li className="about-us-list-item">
                Seamless appointment booking system for users and businesses.
              </li>
              <li className="about-us-list-item">
                Business owners can easily manage their profiles, services, and
                appointments.
              </li>
              <li className="about-us-list-item">
                A user-friendly interface to browse and filter businesses based
                on categories.
              </li>
            </ul>
          </section>

          <section className="about-us-section">
            <h2 className="about-us-subtitle">Our Team</h2>
            <p className="about-us-text">
              Our team consists of dedicated professionals who are passionate
              about bridging the gap between businesses and users. We are
              committed to constantly improving our platform to provide the best
              experience for everyone.
            </p>
          </section>
        </div>
        <Footer /> {/* Add Footer at the bottom */}
      </div>
    </div>
  );
};

export default AboutUs;

import React from "react";
import "./PrivacyPolicy.css"; // Import the CSS file for styling
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import { useNavigate } from "react-router-dom";
import { IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  return (
    <>
      <Header />
      <div className="privacy-policy-container">
        <div className="privacy-policy-content">
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
          <h1 className="privacy-policy-title">Privacy Policy</h1>
          <p className="privacy-policy-date">Last updated: 11/12/2024</p>

          <section className="privacy-policy-section">
            <h2 className="privacy-policy-heading">Introduction</h2>
            <p className="privacy-policy-text">
              Welcome to Business Locator, where businesses can list their
              services, locate themselves on a map, and allow users to book
              appointments. We value your privacy and are committed to
              protecting your personal information.
            </p>
            <p className="privacy-policy-text">
              This Privacy Policy explains how we collect, use, store, and
              protect your personal data when you use our platform. By accessing
              or using our services, you agree to the terms outlined in this
              policy.
            </p>
          </section>

          <section className="privacy-policy-section">
            <h2 className="privacy-policy-heading">Information We Collect</h2>
            <p className="privacy-policy-text">
              We collect the following types of information to provide you with
              the best experience:
            </p>
            <ul className="privacy-policy-list">
              <li className="privacy-policy-list-item">
                <strong>Personal Information from Users:</strong> We collect
                your name, email, phone number, and appointment details for
                booking and communication purposes.
              </li>
              <li className="privacy-policy-list-item">
                <strong>Business Information:</strong> Businesses provide
                details such as their business name, address, contact
                information, and services offered.
              </li>
              <li className="privacy-policy-list-item">
                <strong>Payment Information:</strong> If you make a booking,
                payment information is processed through secure third-party
                payment gateways.
              </li>
              <li className="privacy-policy-list-item">
                <strong>Technical Data:</strong> We may collect data related to
                your device, browser, and usage patterns for website improvement
                and analytics.
              </li>
            </ul>
          </section>

          <section className="privacy-policy-section">
            <h2 className="privacy-policy-heading">
              How We Use Your Information
            </h2>
            <p className="privacy-policy-text">
              The information we collect is used for the following purposes:
            </p>
            <ul className="privacy-policy-list">
              <li className="privacy-policy-list-item">
                To process and confirm appointment bookings.
              </li>
              <li className="privacy-policy-list-item">
                To communicate updates regarding your appointment or any changes
                to services.
              </li>
              <li className="privacy-policy-list-item">
                To help businesses manage their listings, services, and
                appointments.
              </li>
              <li className="privacy-policy-list-item">
                To enhance the platform and user experience through analytics
                and feedback.
              </li>
            </ul>
          </section>

          <section className="privacy-policy-section">
            <h2 className="privacy-policy-heading">Data Sharing</h2>
            <p className="privacy-policy-text">
              We do not sell, rent, or trade your personal information. We may
              share data under the following circumstances:
            </p>
            <ul className="privacy-policy-list">
              <li className="privacy-policy-list-item">
                With third-party service providers who assist in operating the
                platform, such as payment processors, cloud hosting providers,
                and email services.
              </li>
              <li className="privacy-policy-list-item">
                To comply with legal obligations, resolve disputes, or enforce
                agreements, as required by law or regulation.
              </li>
            </ul>
          </section>

          <section className="privacy-policy-section">
            <h2 className="privacy-policy-heading">Data Security</h2>
            <p className="privacy-policy-text">
              We implement industry-standard security measures to protect your
              information from unauthorized access, alteration, or destruction.
              This includes secure servers, data encryption, and regular audits.
            </p>
            <p className="privacy-policy-text">
              However, please be aware that no data transmission method over the
              internet or electronic storage is completely secure. While we
              strive to protect your information, we cannot guarantee absolute
              security.
            </p>
          </section>

          <section className="privacy-policy-section">
            <h2 className="privacy-policy-heading">Your Rights</h2>
            <p className="privacy-policy-text">
              Depending on your location, you may have the following rights
              concerning your personal information:
            </p>
            <ul className="privacy-policy-list">
              <li className="privacy-policy-list-item">
                The right to access, correct, or delete the personal data we
                hold about you.
              </li>
              <li className="privacy-policy-list-item">
                The right to object to or restrict how we use your information.
              </li>
              <li className="privacy-policy-list-item">
                The right to withdraw consent for processing personal data,
                where applicable.
              </li>
            </ul>
            <p className="privacy-policy-text">
              If you wish to exercise any of these rights, please contact us
              through the details provided below.
            </p>
          </section>

          <section className="privacy-policy-section">
            <h2 className="privacy-policy-heading">Changes to This Policy</h2>
            <p className="privacy-policy-text">
              We may update this Privacy Policy periodically to reflect changes
              in our practices or for other operational, legal, or regulatory
              reasons. We will post the updated policy on this page and indicate
              the date of the latest revision.
            </p>
          </section>

          <section className="privacy-policy-section">
            <h2 className="privacy-policy-heading">Contact Us</h2>
            <p className="privacy-policy-text">
              If you have any questions or concerns about this Privacy Policy or
              how we handle your data, please reach out to us:
            </p>
            <p className="privacy-policy-text">
              <strong>Email:</strong> businesslocator@gmail.com <br />
              <strong>Phone:</strong> 9876543210 <br />
              <strong>Address:</strong> Surat, India
            </p>
          </section>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PrivacyPolicy;

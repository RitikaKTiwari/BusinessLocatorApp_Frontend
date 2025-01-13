import React, { useState } from "react";
import axios from "axios";
import "./ContactUs.css";

const ContactUs = ({ closePopup }) => {  // Accept closePopup as a prop
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !message) {
      setError("All fields are required.");
      return;
    }

    const contactData = { name, email, message };

    try {
      const response = await axios.post(
        "http://localhost:5196/api/ContactUs/send",
        contactData
      );

      if (response.data.success) {
        alert("Your message has been sent successfully!");
        setSuccessMessage("Your message has been sent successfully!");
        setName("");
        setEmail("");
        setMessage("");
        setError("");
        closePopup();  // Close the popup on successful submission
      } else {
        setError("There was an issue sending your message. Please try again.");
      }
    } catch (err) {
      setError("There was an error sending your message. Please try again later.");
    }
  };

  return (
    <div className="contact-us-container">
      <div className="contact-card-container">
        <button className="contact-close-button" onClick={closePopup}>
          ✖
        </button>
        <h2 className="contact-card-title">Let's Keep in Touch</h2>
        <div className="contact-card-content">
          <form className="contact-form-container" onSubmit={handleSubmit}>
            <div className="contact-form-group">
              <label className="contact-input-label">Your Name</label>
              <input
                type="text"
                className="contact-form-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="contact-form-group">
              <label className="contact-input-label">Email</label>
              <input
                type="email"
                className="contact-form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="contact-form-group">
              <label className="contact-input-label">Message</label>
              <textarea
                className="contact-form-input contact-form-textarea"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              ></textarea>
            </div>

            <button className="contact-send-button" type="submit">
            ➤
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
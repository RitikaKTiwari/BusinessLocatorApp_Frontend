import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Registration.css";
import { useNavigate } from "react-router-dom";
import InputField from "../../Reusable/InputField";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "./Modal.css";

const BusinessRegistration = () => {
  const [businessname, setBusinessname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [description, setDescription] = useState("");
  const [contactNo, setContactNo] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [address, setAddress] = useState({
    street: "",
    location: "",
    latitude: "",
    longitude: "",
    isPrimary: false,
  });
  const [adminComments, setAdminComments] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const navigate = useNavigate();

  // Handle change in address fields
  const handleAddressChange = (field, value) => {
    setAddress((prevAddress) => ({
      ...prevAddress,
      [field]: value,
    }));
  };

  // Validate fields
  const validateField = (name, value) => {
    const errors = { ...fieldErrors };

    switch (name) {
      case "businessname":
        if (!value.trim()) {
          errors.businessname = "Business name is required.";
        } else {
          delete errors.businessname;
        }
        break;
      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value.trim()) {
          errors.email = "Email Address is required.";
        } else if (!emailRegex.test(value)) {
          errors.email = "Invalid email format.";
        } else {
          delete errors.email;
        }
        break;

      case "password":
        if (!value) {
          errors.password = "Password is required.";
        } else if (value.length < 8) {
          errors.password = "Password must be at least 8 characters.";
        } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
          // Check for special characters
          errors.password =
            "Password must contain at least one special character.";
        } else if (!/[A-Z]/.test(value)) {
          // Check for at least one uppercase letter
          errors.password =
            "Password must contain at least one uppercase letter.";
        } else if (!/[0-9]/.test(value)) {
          // Check for at least one number
          errors.password = "Password must contain at least one number.";
        } else {
          delete errors.password; // Validation passed, clear the error
        }
        break;

      case "contactNo":
        const phoneRegex = /^[0-9]{10}$/;
        if (!value.trim()) {
          errors.contactNo = "Contact Number is required.";
        } else if (!phoneRegex.test(value)) {
          errors.contactNo = "Contact Number must be a valid 10-digit number.";
        } else {
          delete errors.contactNo;
        }
        break;
      default:
        break;
    }

    setFieldErrors(errors);
  };

  // Capture map click to set latitude and longitude
  const LocationMap = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        handleAddressChange("latitude", lat);
        handleAddressChange("longitude", lng);
        setShowMap(false); // Close the map after selection
      },
    });

    return null;
  };

  const validateFields = () => {
    validateField("businessname", businessname);
    validateField("email", email);
    validateField("password", password);
    validateField("contactNo", contactNo);

    return Object.keys(fieldErrors).length === 0;
  };

  // Form submission handler
  const handleRegister = async (e) => {
    e.preventDefault();

    if (!validateFields()) {
      return;
    }

    const businessData = {
      name: businessname,
      email: email,
      password: password,
      description: description,
      contactNo: contactNo,
      address: {
        street: address.street,
        location: address.location,
        latitude: parseFloat(address.latitude),
        longitude: parseFloat(address.longitude),
        isPrimary: true,
      },
      adminComments: adminComments,
    };

    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5196/api/Business/user/request",
        businessData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        alert("Business registration request sent for approval!");
        navigate("/Login");
      } else {
        setError("Registration failed. Please try again.");
      }
    } catch (error) {
      if (error.response) {
        setError(
          error.response.data.message ||
            "Registration failed. Please try again."
        );
      } else {
        setError("An error occurred. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handlebusinessChange = (e) => {
    const value = e.target.value.replace(/[^a-zA-Z]/g, ""); // Only allows alphabets
    setBusinessname(value);
    validateField("businessname", value);
  };

  const handleContactNoChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, ""); // Only allows numbers
    setContactNo(value);
    validateField("contactNo", value);
  };

  return (
    <div className="center-container">
      <div className="signbox">
        <h1 className="title">Register Your Business and Grow with Us!</h1>
        <form>
          <div className="left-right-columns">
            <div className="left-column">
              <div className="form-group">
                <label>Business Name</label>
                <InputField
                  type="text"
                  placeholder="Business Name"
                  value={businessname}
                  onChange={handlebusinessChange}
                />
                {fieldErrors.businessname && (
                  <div className="error-message">
                    {fieldErrors.businessname}
                  </div>
                )}
              </div>
              <div className="form-group">
                <label>Email</label>
                <InputField
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    validateField("email", e.target.value);
                  }}
                />
                {fieldErrors.email && (
                  <div className="error-message">{fieldErrors.email}</div>
                )}
              </div>
              <div className="form-group">
                <label>Password</label>
                <InputField
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    validateField("password", e.target.value);
                  }}
                />
                {fieldErrors.password && (
                  <div className="error-message">{fieldErrors.password}</div>
                )}
              </div>
              <div className="form-group">
                <label>Description</label>
                <InputField
                  type="text"
                  placeholder="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
                {fieldErrors.description && (
                  <div className="error-message">{fieldErrors.description}</div>
                )}
              </div>
              <div className="form-group">
                <label>Contact Number</label>
                <InputField
                  type="text"
                  placeholder="Contact Number"
                  value={contactNo}
                  onChange={handleContactNoChange}
                />
                {fieldErrors.contactNo && (
                  <div className="error-message">{fieldErrors.contactNo}</div>
                )}
              </div>
            </div>
            <div className="right-column">
              <h4>Location Information</h4>
              <div className="form-group">
                <label>Street</label>
                <InputField
                  type="text"
                  placeholder="Street"
                  value={address.street}
                  onChange={(e) =>
                    handleAddressChange("street", e.target.value)
                  }
                />
                {fieldErrors.street && (
                  <div className="error-message">{fieldErrors.street}</div>
                )}
              </div>
              <div className="form-group">
                <label>Location</label>
                <InputField
                  type="text"
                  placeholder="Location"
                  value={address.location}
                  onChange={(e) =>
                    handleAddressChange("location", e.target.value)
                  }
                />
                {fieldErrors.location && (
                  <div className="error-message">{fieldErrors.location}</div>
                )}
              </div>
              <div className="form-group">
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => setShowMap(true)}
                >
                  Open Map
                </button>

                <div className="form-group">
                  <label>Latitude</label>
                  <InputField
                    type="text"
                    placeholder="Latitude"
                    value={address.latitude || ""}
                    readOnly
                  />
                </div>
                <div className="form-group">
                  <label>Longitude</label>
                  <InputField
                    type="text"
                    placeholder="Longitude"
                    value={address.longitude || ""}
                    readOnly
                  />
                </div>
              </div>
            </div>
          </div>
          {showMap && (
            <div className="business-registration-reigister-modal">
              <div className="business-registration-reigister-modal-content">
                <span
                  className="business-registration-reigister-close"
                  onClick={() => setShowMap(false)}
                >
                  &times;
                </span>
                <MapContainer
                  center={[21.194471, 72.831798]}
                  zoom={13}
                  style={{ height: "400px", width: "100%" }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <LocationMap />
                  {address.latitude && address.longitude && (
                    <Marker
                      position={[address.latitude, address.longitude]}
                      icon={L.icon({
                        iconUrl: require("leaflet/dist/images/marker-icon.png"),
                        iconSize: [25, 40],
                      })}
                    >
                      <Popup>
                        Latitude: {address.latitude}, Longitude:{" "}
                        {address.longitude}
                      </Popup>
                    </Marker>
                  )}
                </MapContainer>
              </div>
            </div>
          )}

          <div className="buttonreg-section">
            <button
              type="submit"
              className="insert-btn"
              disabled={loading}
              onClick={handleRegister}
            >
              {loading ? "Registering..." : "Register"}
            </button>
            <button
              type="button"
              className="cancel-btn"
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BusinessRegistration;

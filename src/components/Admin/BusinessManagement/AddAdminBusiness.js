import React, { useState } from "react";
import axios from "axios";
import "../../Sign_Auth/Registration/Registration.css";
import "./AddAdminBusiness.css";
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
import "../../Sign_Auth/Registration/Modal.css";

const AdminAddBusiness = ({ setActiveSection }) => {
  const [businessname, setBusinessname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [description, setDescription] = useState("");
  const [contactNo, setContactNo] = useState("");
  const [address, setAddress] = useState({
    street: "",
    location: "",
    latitude: "",
    longitude: "",
  });
  const [adminComments, setAdminComments] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [showMap, setShowMap] = useState(false);
  const navigate = useNavigate();

  const handleAddressChange = (field, value) => {
    setAddress((prevAddress) => ({
      ...prevAddress,
      [field]: value,
    }));
  };

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

  const LocationMap = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        handleAddressChange("latitude", lat);
        handleAddressChange("longitude", lng);
        setShowMap(false);
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

  const handleRegister = async (e) => {
    if (!validateFields()) {
      return;
    }

    e.preventDefault();

    const businessData = {
      name: businessname,
      email,
      passwordHash: password,
      description,
      contactNo,
      address: {
        ...address,
        latitude: parseFloat(address.latitude),
        longitude: parseFloat(address.longitude),
        isPrimary: true,
      },
    };

    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5196/api/Business/admin/addbusiness",
        businessData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        alert("Business added successfully!");
        setActiveSection("Dashboard"); // Update the active section
        navigate("/AdminMain");
      } else {
        setError("Registration failed. Please try again.");
      }
    } catch (err) {
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
    <div className="ab-bg-img">
      <div className="ab-signbox">
        <h1 className="ab-registration-title">Add new Business</h1>
        <form onSubmit={handleRegister}>
          <div className="ab-left-right-columns">
            <div className="ab-left-column">
              <h4>Business Information</h4>
              <div className="ab-form-group">
                <label>Business Name</label>
                <InputField
                  type="text"
                  placeholder="Business Name"
                  value={businessname}
                  onChange={handlebusinessChange}
                />
                {fieldErrors.businessname && (
                  <div className="ab-error-message">
                    {fieldErrors.businessname}
                  </div>
                )}
              </div>
              <div className="ab-form-group">
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
                  <div className="ab-error-message">{fieldErrors.email}</div>
                )}
              </div>
              <div className="ab-form-group">
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
                  <div className="ab-error-message">{fieldErrors.password}</div>
                )}
              </div>
              <div className="ab-form-group">
                <label>Description</label>
                <InputField
                  type="text"
                  placeholder="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
                {fieldErrors.description && (
                  <div className="ab-error-message">
                    {fieldErrors.description}
                  </div>
                )}
              </div>
              <div className="ab-form-group">
                <label>Contact Number</label>
                <InputField
                  type="text"
                  placeholder="Contact Number"
                  value={contactNo}
                  onChange={handleContactNoChange}
                />
                {fieldErrors.contactNo && (
                  <div className="ab-error-message">
                    {fieldErrors.contactNo}
                  </div>
                )}
              </div>
            </div>
            <div className="ab-right-column">
              <h4>Location Information</h4>
              <div className="ab-form-group">
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
              <div className="ab-form-group">
                <label>Location</label>
                <InputField
                  type="text"
                  placeholder="Location"
                  value={address.location}
                  onChange={(e) =>
                    handleAddressChange("location", e.target.value)
                  }
                />
              </div>
              {fieldErrors.location && (
                <div className="error-message">{fieldErrors.location}</div>
              )}
              <label>Mark on map</label>
              <div className="ab-form-group">
                <button
                  type="button"
                  className="ab-btn"
                  onClick={() => setShowMap(true)}
                >
                  Select Location
                </button>
              </div>
              <div className="ab-form-group">
                <label>Latitude</label>
                <InputField
                  type="text"
                  placeholder="Latitude"
                  value={address.latitude || ""}
                  readOnly
                />
              </div>
              <div className="ab-form-group">
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
          <div className="ab-center-bottom">
            {error && (
              <div style={{ color: "red", textAlign: "center" }}>{error}</div>
            )}
            <div className="ab-buttonreg-section">
              <button className="insert-btn" type="submit" disabled={loading}>
                {loading ? "Registering..." : "Register"}
              </button>
              <button
                className="cancel-btn"
                type="button"
                onClick={() => {
                  setActiveSection("Dashboard"); // Update the active section
                  navigate("/AdminMain"); // Navigate to AdminMain route
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
      {showMap && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setShowMap(false)}>
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
                    Latitude: {address.latitude}, Longitude: {address.longitude}
                  </Popup>
                </Marker>
              )}
            </MapContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAddBusiness;

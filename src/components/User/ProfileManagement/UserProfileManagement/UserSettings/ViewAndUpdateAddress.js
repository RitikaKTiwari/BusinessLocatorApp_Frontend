import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AccountSettings.css";
import { useNavigate } from "react-router-dom";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "./ViewAndUpdateAddress.css";
import Header from "../../../Header/Header";
import Footer from "../../../Footer/Footer";
import { IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const ViewAndUpdateAddress = () => {
  const navigate = useNavigate();
  const [addressInfo, setAddressInfo] = useState({
    street: "",
    location: "",
    latitude: "",
    longitude: "",
  });
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [updatedAddress, setUpdatedAddress] = useState(addressInfo);
  const [addressId, setAddressId] = useState(null);
  const [isMapOpen, setIsMapOpen] = useState(false); // New state to control map visibility

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    // Fetch address info on component mount (replace with your API call)
    axios
      .get(`http://localhost:5196/api/Address/User/${userId}`)
      .then((response) => {
        axios
          .get(`http://localhost:5196/api/Address/${response.data.id}`)
          .then((response) => {
            setAddressInfo(response.data);
            setUpdatedAddress(response.data);
          });
      })

      .catch((error) => console.error("Error fetching address info:", error));
  }, []);

  const handleAddressUpdate = () => {
    if (addressId === 0) {
      updatedAddress.isPrimary = true;
      const response = axios.post(
        `http://localhost:5196/api/Address?userId=${userId}`,
        updatedAddress
      );
      //    if(response.status === 201)
      //    {

      alert("Address Successfully Added!");
      setIsPopupOpen(false);
      //    }
    } else {
      axios
        .put(`http://localhost:5196/api/Address/${addressId}`, updatedAddress)
        .then((response) => {
          setAddressInfo(response.data);
          alert("Address Updated Successfully!");
          setIsPopupOpen(false);
        })
        .catch((error) => console.error("Error updating address:", error));
    }
  };

  // Capture map click to set latitude and longitude
  const LocationMap = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setUpdatedAddress((prev) => ({
          ...prev,
          latitude: lat,
          longitude: lng,
        }));
        setIsMapOpen(false); // Close the map after selection
      },
    });

    return null;
  };

  return (
    <>
      <div>
        <Header></Header>
      </div>
      <div className="viewandupdateaddress-account-settings">
        <div style={{ marginRight: 600 }}>
          <IconButton
            onClick={() => {
              navigate(-1);
            }}
            aria-label="back"
          >
            <ArrowBackIcon />
          </IconButton>
        </div>

        <div
          className="viewandupdateaddress-card address-card"
          onClick={() => {
            setIsPopupOpen(true);
            setAddressId(addressInfo.id || 0);
          }}
        >
          <h2>Address Information</h2>
          <p>
            <strong>Street:</strong> {addressInfo.street}
          </p>
          <p>
            <strong>Location:</strong> {addressInfo.location}
          </p>
          <p>
            <strong>Latitude:</strong> {addressInfo.latitude}
          </p>
          <p>
            <strong>Longitude:</strong> {addressInfo.longitude}
          </p>
        </div>

        {/* Address Update Popup */}
        {isPopupOpen && (
          <div className="viewandupdateaddress-popup">
            <div className="viewandupdateaddress-popup-content">
              <h2>Update Address</h2>
              <label>
                Street:
                <input
                  type="text"
                  value={updatedAddress.street}
                  onChange={(e) =>
                    setUpdatedAddress({
                      ...updatedAddress,
                      street: e.target.value,
                    })
                  }
                />
              </label>
              <label>
                Location:
                <input
                  type="text"
                  value={updatedAddress.location}
                  onChange={(e) =>
                    setUpdatedAddress({
                      ...updatedAddress,
                      location: e.target.value,
                    })
                  }
                />
              </label>
              <button onClick={() => setIsMapOpen(true)}>
                Select Location on Map
              </button>{" "}
              {/* Open map */}
              <label>
                Latitude:
                <input
                  type="text"
                  value={updatedAddress.latitude}
                  onChange={(e) =>
                    setUpdatedAddress({
                      ...updatedAddress,
                      latitude: e.target.value,
                    })
                  }
                />
              </label>
              <label>
                Longitude:
                <input
                  type="text"
                  value={updatedAddress.longitude}
                  onChange={(e) =>
                    setUpdatedAddress({
                      ...updatedAddress,
                      longitude: e.target.value,
                    })
                  }
                />
              </label>
              <div className="popup-actions">
                <button
                  className="viewandupdateaddress-button"
                  onClick={handleAddressUpdate}
                >
                  Save
                </button>
                <button
                  className="viewandupdateaddress-button-cancel"
                  onClick={() => setIsPopupOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal for Map */}
        {isMapOpen && (
          <div className="viewandupdateaddress-modal">
            <div className="viewandupdateaddress-modal-content">
              <span
                className="viewandupdateaddress-close"
                onClick={() => setIsMapOpen(false)}
              >
                &times;
              </span>
              <MapContainer
                center={[
                  updatedAddress.latitude || 21.194471,
                  updatedAddress.longitude || 72.831798,
                ]}
                zoom={13}
                style={{ height: "400px", width: "100%" }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <LocationMap />
                {updatedAddress.latitude && updatedAddress.longitude && (
                  <Marker
                    position={[
                      updatedAddress.latitude,
                      updatedAddress.longitude,
                    ]}
                    icon={L.icon({
                      iconUrl: require("leaflet/dist/images/marker-icon.png"),
                      iconSize: [25, 40],
                    })}
                  >
                    <Popup>
                      Latitude: {updatedAddress.latitude}, Longitude:{" "}
                      {updatedAddress.longitude}
                    </Popup>
                  </Marker>
                )}
              </MapContainer>
            </div>
          </div>
        )}
      </div>
      <footer>
        <Footer></Footer>
      </footer>
    </>
  );
};

export default ViewAndUpdateAddress;

import React, { useState, useEffect } from "react";
import axios from "axios";
import ApprovedDialogComponent from '../../User/DialogComponent/ApprovedDialogComponent';
import "./ViewBusinessService.css";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../Header/Header";
import { IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Footer from "../Footer/Footer";

const ViewBusinessService = () => {
  const [services, setServices] = useState([]);
  const [business, setBusiness] = useState([]);
  const [selectedServiceId, setSelectedServiceId] = useState();
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [selectedServiceDetails, setSelectedServiceDetails] = useState();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [notification, setNotification] = useState("");
  const [serviceImages, setServiceImages] = useState({}); // To store images for each service
  const navigate = useNavigate();
  const [favoriteServices, setFavoriteServices] = useState([]);
     const [approvedDialogOpen, setApprovedDialogOpen] = useState(false);
      const [message, setMessage] = useState("");
  const [address, setAddress] = useState({
    street: "",
    location: "",
    latitude: "",
    longitude: "",
    isPrimary: false,
  });
  const [showMap, setShowMap] = useState(false);
  const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false);

  const userId = localStorage.getItem("userId");
  const { businessId } = useParams();

  const handleAddressChange = (field, value) => {
    setAddress((prevAddress) => ({
      ...prevAddress,
      [field]: value,
    }));
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

  const fetchBusiness = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5196/api/Business/${businessId}`
      );
      setBusiness(response.data);
    } catch (error) {
      console.error("Error fetching business:", error);
    }
  };

  const fetchServices = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5196/api/BusinessService/Business/${businessId}`
      );
      setServices(response.data);

      for (const service of response.data) {
        fetchServiceImages(service.id);
      }
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  const fetchServiceImages = async (businessServiceId) => {
    try {
      const response = await axios.get(
        `http://localhost:5196/api/BusinessService/Images/${businessServiceId}`
      );
      console.log(response.data);
      setServiceImages((prev) => ({
        ...prev,
        [businessServiceId]: response.data, // Store the images by businessServiceId
      }));
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  const getCurrentDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const getCurrentTime = () => {
    const now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    if (minutes < 10) {
      minutes = `0${minutes}`;
    }
    if (hours < 10) {
      hours = `0${hours}`;
    }
    return `${hours}:${minutes}`;
  };

  const toggleServiceDetails = (serviceId) => {
    if (selectedServiceId === serviceId) {
      setSelectedServiceId(null);
      setSelectedServiceDetails(null);
    } else {
      setSelectedServiceId(serviceId);
      const service = services.find((service) => service.id === serviceId);
      setSelectedServiceDetails(service);
    }
  };

  const formatOperatingHours = (hours) => {
    return hours.split(",").map((dayTime, index) => {
      const separatorIndex = dayTime.indexOf(":");
      const day = dayTime.substring(0, separatorIndex).trim();
      const time = dayTime.substring(separatorIndex + 1).trim();
      return (
        <div key={index} className="day-time-row">
          <span className="day">{day}</span>
          <span className="time">{time}</span>
        </div>
      );
    });
  };

  const handleDateChange = (e) => setAppointmentDate(e.target.value);
  const handleTimeChange = (e) => setAppointmentTime(e.target.value);

  const openDialog = () => {
    setApprovedDialogOpen(true);
  };

  const closeDialog = () => {
    setApprovedDialogOpen(false);
  };

  const getMinTime = () => {
    const currentDate = getCurrentDate();
    const currentTime = getCurrentTime();

    if (appointmentDate === currentDate) {
      return currentTime;
    }
    return "00:00";
  };

  const handleServiceClick = async (serviceId) => {
    if (!userId) {
      alert("You are not currently logged in!!!");
      navigate("/Login");
    } else {
      const response = await axios.get(
        `http://localhost:5196/Api/Address/User/${userId}`
      );
      if (response.data.length === 0) {
        setSelectedServiceId(serviceId);
        setIsAddressDialogOpen(true);
        setAddress({
          street: "",
          location: "",
          latitude: "",
          longitude: "",
          isPrimary: false,
        });
      } else {
        setSelectedServiceId(serviceId);
        setIsDialogOpen(true); // Open the appointment dialog
      }
    }
  };

  const handleDialogClose = () => {
    setAppointmentDate("");
    setAppointmentTime("");
    setIsDialogOpen(false);
    setIsAddressDialogOpen(false); // Hide address dialog
  };

  const handleSubmitAppointment = async (e) => {
    e.preventDefault();

    const appointmentData = {
      BusinessServiceId: selectedServiceId,
      UserId: userId,
      AppointmentDateTime: `${appointmentDate}T${appointmentTime}:00`,
    };

    try {
      const response = await axios.post(
        "http://localhost:5196/api/Appointment",
        appointmentData
      );
      setNotification(response.data);
      setAppointmentDate("");
      setAppointmentTime("");
      setIsDialogOpen(false);
      setMessage("Book");
      openDialog();   
     } catch (error) {
      alert("Appointment Request Made!.");
      console.error("Error booking appointment:", error);
    }
  };

  const AddAddress = async () => {
    address.isPrimary = true;
    const response = await axios.post(
      `http://localhost:5196/api/Address?userId=${userId}`,
      address
    );
    if (response.status === 201) {
      setMessage("Address");
      openDialog();
      setAddress({
        street: "",
        location: "",
        latitude: "",
        longitude: "",
        isPrimary: false,
      });
      setIsAddressDialogOpen(false);
      setIsDialogOpen(true);
    }
    // Open the appointment dialog after address is set
  };

  const fetchFavorites = async () => {
    if (userId) {
      try {
        const response = await axios.get(
          `http://localhost:5196/api/Favourites/${userId}`
        );
        const favoriteIds = response.data.map((fav) => fav.businessServiceId); // Extract service IDs
        setFavoriteServices(favoriteIds);
      } catch (error) {
        console.error("Error fetching favorite services:", error);
      }
    }
  };

  useEffect(() => {
    fetchBusiness();
    fetchServices();
    fetchFavorites();
  }, [businessId, userId, navigate]);

  const toggleFavorite = async (businessServiceId) => {
    if (!userId) {
      alert("You are not currently logged in!!!");
      navigate("/Login");
    } else {
      const isFavorite = favoriteServices.includes(businessServiceId);
      try {
        if (isFavorite) {
          setFavoriteServices((prevFavorites) =>
            prevFavorites.filter((id) => id !== businessServiceId)
          );
          await axios.delete(
            `http://localhost:5196/api/Favourites?userId=${userId}&businessServiceId=${businessServiceId}`,
            {
              data: { userId, businessServiceId },
            }
          );
        } else {
          setFavoriteServices((prevFavorites) => [
            ...prevFavorites,
            businessServiceId,
          ]);
          await axios.post(
            `http://localhost:5196/api/Favourites?userId=${userId}&businessServiceId=${businessServiceId}`,
            {
              userId,
              businessServiceId,
            }
          );
        }
      } catch (error) {
        console.error("Error toggling favorite:", error);
        alert("There was an error updating your favorite. Please try again.");
      }
    }
  };

  return (
    <div>
      <Header></Header>
      
      <div className="mainservice-container">
        <div className="business-business-details">
          {business ? (
            <>
              {/* <h2>Business Name: {business.name}</h2> */}
              <p>
                <strong>Business Name: </strong> {business.name}
              </p>
              <p>
                <strong>Email:</strong> {business.email}
              </p>
              <p>
                <strong>Contact:</strong> {business.contactNo}
              </p>
              <p>
                <strong>Description:</strong> {business.description}
              </p>
            </>
          ) : (
            <p>Loading business details...</p>
          )}
        </div>
        <div>
        <IconButton
          onClick={() => {
            navigate(-1);
          }}
          style={{marginLeft:'100px'}}
          aria-label="back"
        >
          <ArrowBackIcon />
        </IconButton>
      </div>
        <h2>Business Services</h2>

        <div class="service-container">
          {services.length > 0 ? (
            services.map((service) => (
              <div key={service.id} className="service-card">
                <div
                  className="favorite-icon"
                  onClick={() => toggleFavorite(service.id)}
                >
                  {favoriteServices.includes(service.id) ? (
                    <span className="heart filled">❤</span>
                  ) : (
                    <span className="heart">🤍</span>
                  )}
                </div>
                <div className="service-image">
                  {serviceImages[service.id] &&
                    serviceImages[service.id].map((image, index) => (
                      <img
                        key={index}
                        src={image.imageUrl}
                        alt={`Service ${index}`}
                      />
                    ))}
                </div>
                <h3>{service.service.name}</h3>
                <p>{service.service.description}</p>
                <p>Price: {service.price}</p>
                <button
                  className="book-apt"
                  onClick={() => handleServiceClick(service.id)}
                >
                  Book Appointment
                </button>
                <div className="service-details">
                  <div
                    className="service-header"
                    onClick={() => toggleServiceDetails(service.id)}
                  >
                    <p>
                      <strong>Operating Hours:</strong>{" "}
                      {selectedServiceId === service.id ? "↓" : "↑"}
                    </p>
                  </div>
                  {selectedServiceId === service.id &&
                    selectedServiceDetails && (
                      <div className="operating-hours">
                        {formatOperatingHours(
                          selectedServiceDetails.daysOfWeekFormatted
                        )}
                      </div>
                    )}
                </div>
              </div>
            ))
          ) : (
            <p>No services available for this business.</p>
          )}
        </div>

        {/* Appointment dialog */}
        {isDialogOpen && (
          <div className="dialog-overlay">
            <div className="dialog">
              <h4>Book an Appointment</h4>
              <form onSubmit={handleSubmitAppointment}>
                <label>Choose a date:</label>
                <input
                  type="date"
                  value={appointmentDate}
                  onChange={handleDateChange}
                  min={getCurrentDate()}
                  style={{ width: "90%" }}
                  required
                />

                <label>Choose a time:</label>
                <input
                  type="time"
                  value={appointmentTime}
                  onChange={handleTimeChange}
                  min={getMinTime()}
                  style={{ width: "90%" }}
                  required
                />

                <div className="dialog-actions">
                  <button type="submit">Submit Appointment</button>
                  <button type="button" onClick={handleDialogClose}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Address dialog */}
        {isAddressDialogOpen && (
          <div className="dialog-overlay">
            <div className="dialog">
              <h4>Location Information</h4>
              <div className="form-group">
                <label>Street</label>
                <input
                  type="text"
                  placeholder="Street"
                  value={address.street}
                  onChange={(e) =>
                    handleAddressChange("street", e.target.value)
                  }
                />
              </div>
              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  placeholder="Location"
                  value={address.location}
                  onChange={(e) =>
                    handleAddressChange("location", e.target.value)
                  }
                />
              </div>
              <div className="form-group">
                <button
                  type="button"
                  className="btn"
                  onClick={() => setShowMap(true)}
                >
                  Select Location
                </button>
              </div>
              <div className="form-group">
                <label>Latitude</label>
                <input
                  type="text"
                  placeholder="Latitude"
                  value={address.latitude || ""}
                  readOnly
                />
              </div>
              <div className="form-group">
                <label>Longitude</label>
                <input
                  type="text"
                  placeholder="Longitude"
                  value={address.longitude || ""}
                  readOnly
                />
              </div>

              <button className="btn" onClick={AddAddress}>
                Add Address
              </button>
              <button type="button" onClick={handleDialogClose}>
                Cancel
              </button>
            </div>
          </div>
        )}

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
                      Latitude: {address.latitude}, Longitude:{" "}
                      {address.longitude}
                    </Popup>
                  </Marker>
                )}
              </MapContainer>
            </div>
          </div>
        )}
              {approvedDialogOpen && <ApprovedDialogComponent onClose={closeDialog} message={message} />}
      </div>
      <footer>
        <Footer />
      </footer>
    </div>
  );
};

export default ViewBusinessService;

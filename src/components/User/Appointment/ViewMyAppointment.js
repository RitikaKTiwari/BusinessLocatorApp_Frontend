import React, { useState, useEffect } from 'react';
import axios from 'axios';
import RatingPopup from './Rating'; // Importing the RatingPopup component
import './ViewMyAppointment.css'; // Import the CSS for ViewMyAppointment
import  Header from '../Header/Header';
import Footer from '../Footer/Footer';
import { IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from 'react-router-dom';

const ViewMyAppointment = () => {
  const [selectedOption, setSelectedOption] = useState('booked');
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showRatingPopup, setShowRatingPopup] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const userId = localStorage.getItem('userId');
const navigate=useNavigate();
  // Fetch appointments data
  const fetchAppointments = async () => {
    setLoading(true);
    setError(null);
    try {
      const endpoint =
        selectedOption === 'booked'
          ? `http://localhost:5196/api/Appointment/booked/${userId}`
          : `http://localhost:5196/api/Appointment/served/${userId}`;

      const response = await axios.get(endpoint);

      // Fetch ratings for the appointments
      const appointmentsWithRatings = await Promise.all(
        response.data.map(async (appointment) => {
          try {
            const ratingResponse = await axios.get(
              `http://localhost:5196/api/Rating/${userId}/${appointment.businessServiceId}`
            );
            return {
              ...appointment,
              hasRating: !!ratingResponse.data, // If rating exists, set to true
            };
          } catch {
            return { ...appointment, hasRating: false }; // No rating found
          }
        })
      );

      setAppointments(appointmentsWithRatings);
    } catch (err) {
      setError('Failed to fetch appointments.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [selectedOption]);

  // Function to open rating popup
  const openRatingPopup = (appointment) => {
    setSelectedAppointment(appointment);
    setShowRatingPopup(true);
  };

  // Function to close rating popup
  const closeRatingPopup = () => {
    setShowRatingPopup(false);
    setSelectedAppointment(null);
  };

  return (
    <div className="appointment-container">
      <Header></Header>
      <h1>View My Appointments</h1>
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
      <div className="select-container">
        <label htmlFor="appointmentType">Select Appointment Type:</label>
        <select
          id="appointmentType"
          value={selectedOption}
          onChange={(e) => setSelectedOption(e.target.value)}
        >
          <option value="booked">Booked Services</option>
          <option value="served">Served Services</option>
        </select>
      </div>

      {loading && <p className="loading">Loading...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && !error && appointments.length > 0 && (
        <div className="appointments-list">
          <h2>{selectedOption === 'booked' ? 'Booked Services' : 'Served Services'}</h2>
          <div className="appointments-card-container">
            {appointments.map((appointment) => (
              <div key={appointment.appointmentId} className="appointment-card">
                <div className="appointment-details">
                  <h3>{appointment.businessServiceName}</h3>
                  <p>
                    <strong>Date:</strong> {appointment.appointmentDate}
                  </p>
                  <p>
                    <strong>Time:</strong> {appointment.appointmentTime}
                  </p>

                  {selectedOption === 'served' && (
                    <button
                      className="rating-button"
                      onClick={() => openRatingPopup(appointment)}
                    >
                      {appointment.hasRating ? 'View Review' : 'Give Review'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!loading && !error && appointments.length === 0 && (
        <p className="no-appointments">No appointments found for the selected option.</p>
      )}

      {/* Rating Popup Component */}
      {showRatingPopup && selectedAppointment && (
        <RatingPopup
          userId={userId}
          businessServiceId={selectedAppointment.businessServiceId}
          hasRating={selectedAppointment.hasRating}
          onClose={closeRatingPopup}
        />
      )}

      <Footer></Footer>
    </div>
  );
};

export default ViewMyAppointment;
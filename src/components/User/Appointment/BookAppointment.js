import React, { useState } from "react";
import { useParams } from "react-router-dom"; // Import useParams for accessing dynamic params
import axios from "axios";
import './BookAppointment.css';

const BookAppointment = () => {
   // const { businessServiceId } = useParams(); // Get the dynamic businessServiceId from the URL
    const { businessServiceId } = 5; // Get the dynamic businessServiceId from the URL

    const [selectedDateTime, setSelectedDateTime] = useState("");
    const [bookingStatus, setBookingStatus] = useState("");

    const handleDateTimeChange = (event) => {
        setSelectedDateTime(event.target.value);
    };

    const bookAppointment = async () => {
        if (!selectedDateTime) {
            alert("Please select a date and time.");
            return;
        }

        try {
            const response = await axios.post("http://localhost:5196/api/Appointment", {
                UserId: 1, // Replace with actual user ID if needed
                BusinessServiceId: businessServiceId,
                AppointmentDateTime: selectedDateTime,
            });

            if (response.status === 200) {
                const { appointmentId, notificationMessage } = response.data;
                setBookingStatus(`Appointment booked successfully with ID: ${appointmentId}. ${notificationMessage}`);
            } else {
                alert("Error booking appointment.");
            }
        } catch (error) {
            console.error("Error booking appointment:", error);
            alert("An error occurred while booking the appointment.");
        }
    };

    return (
        <div>
            <h3>Book an Appointment</h3>
            <input
                type="datetime-local"
                value={selectedDateTime}
                onChange={handleDateTimeChange}
            />
            <button onClick={bookAppointment}>Book Appointment</button>
            {bookingStatus && <p>{bookingStatus}</p>}
        </div>
    );
};

export default BookAppointment;
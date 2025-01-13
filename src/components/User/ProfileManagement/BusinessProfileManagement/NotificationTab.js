import React, { useEffect, useState } from "react";
import axios from "axios";
import "./NotificationTab.css";

const NotificationTab = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [technicians, setTechnicians] = useState([]);
    const [selectedTechnicianId, setSelectedTechnicianId] = useState(null);
    const [selectedTechnicianName, setSelectedTechnicianName] = useState(null);
    const [showDialog, setShowDialog] = useState(false);
    const [currentAppointmentId, setCurrentAppointmentId] = useState(null);
    const [currentBusinessServiceId, setCurrentBusinessServiceId] = useState(null);

    const businessId = localStorage.getItem("businessId");

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:5196/api/Appointment/Business/${businessId}`
                );

                if (response.status === 200) {
                    setAppointments(response.data);
                } else {
                    throw new Error("Failed to fetch appointments");
                }
            } catch (error) {
                console.error("Error fetching appointments:", error);
                alert("An error occurred while fetching appointments. Please check the console for more details.");
            } finally {
                setLoading(false);
            }
        };

        fetchAppointments();
    }, [businessId]);

    const fetchTechnicians = async (businessServiceId) => {
        try {
            const response = await axios.get(
                `http://localhost:5196/api/Technician/businessservice/${businessServiceId}/technicians`
            );

            if (response.status === 200) {
                setTechnicians(response.data);
            } else {
                throw new Error("Failed to fetch technicians");
            }
        } catch (error) {
            console.error("Error fetching technicians:", error);
            alert("An error occurred while fetching technicians.");
        }
    };

    const openApprovalDialog = (appointmentId, businessServiceId) => {
        setCurrentAppointmentId(appointmentId);
        setCurrentBusinessServiceId(businessServiceId);
        fetchTechnicians(businessServiceId);
        setShowDialog(true);
    };

    const handleTechnicianSelect = (technicianId, technicianName) => {
        setSelectedTechnicianId(technicianId);
        setSelectedTechnicianName(technicianName);
    };

    const handleApproveWithTechnician = async () => {
        if (!selectedTechnicianId) {
            alert("Please select a technician before approving.");
            return;
        }

        try {
            const response = await axios.post("http://localhost:5196/api/Appointment/approve", {
                AppointmentId: currentAppointmentId,
                IsApproved: true,
                TechnicianId: selectedTechnicianId,
            });

            if (response.status === 200) {
                setAppointments(appointments.filter((appt) => appt.appointmentId !== currentAppointmentId));
                alert(`Appointment approved successfully with technician: ${selectedTechnicianName}`);
                setShowDialog(false);
                setSelectedTechnicianId(null);
                setSelectedTechnicianName(null);
            } else {
                alert("An error occurred while processing the approval.");
            }
        } catch (error) {
            console.error("Error handling appointment action:", error);
            alert(`Error: ${error.response ? error.response.data : "Unknown error"}`);
        }
    };

    const handleReject = async (appointmentId) => {
        try {
            const response = await axios.post("http://localhost:5196/api/Appointment/approve", {
                AppointmentId: appointmentId,
                IsApproved: false,
            });

            if (response.status === 200) {
                setAppointments(appointments.filter((appt) => appt.appointmentId !== appointmentId));
                alert("Appointment rejected successfully.");
            } else {
                alert("An error occurred while rejecting the appointment.");
            }
        } catch (error) {
            console.error("Error rejecting appointment:", error);
            alert(`Error: ${error.response ? error.response.data : "Unknown error"}`);
        }
    };

    if (loading) {
        return (
            <div className="loading-spinner">
                <span>Loading...</span>
            </div>
        );
    }

    return (
        <div className="appointment-approval-container">
            <h2 className="noth2">Appointment Requests</h2>
            {appointments.length > 0 ? (
                <div className="appointments-list">
                    {appointments.map((appointment) => (
                        <div className="appointment-card" key={appointment.appointmentId}>
                            <div className="appointment-header">
                                <div className="notuser-name">{appointment.userName}</div>
                                <span className="service-name">{appointment.serviceName}</span>
                            </div>
                            <div className="appointment-details">
                                <p>
                                    <strong>Date:</strong> {appointment.appointmentDate}
                                </p>
                                <p>
                                    <strong>Time:</strong> {appointment.appointmentTime}
                                </p>
                                <p>{appointment.notificationMessage}</p>
                            </div>
                            <div className="notappointment-actions">
                                <button
                                    onClick={() =>
                                        selectedTechnicianId
                                            ? handleApproveWithTechnician()
                                            : openApprovalDialog(appointment.appointmentId, appointment.businessServiceId)
                                    }
                                    className="notapprove-btn"
                                >
                                    {selectedTechnicianId ? "Approve" : "Select Technician"}
                                </button>
                                <button
                                    onClick={() => handleReject(appointment.appointmentId)}
                                    className="notreject-btn"
                                >
                                    Reject
                                </button>
                            </div>
                            {selectedTechnicianName && (
                                <p className="selected-technician">
                                    <strong>Selected Technician:</strong> {selectedTechnicianName}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="not-appointments">No pending appointments</div>
            )}

            {showDialog && (
                <div className="dialog-overlay">
                    <div className="dialog-content">
                        <h3>Select Technician</h3>
                        <select
                            value={selectedTechnicianId || ""}
                            onChange={(e) => {
                                const technician = technicians.find((tech) => tech.id === parseInt(e.target.value));
                                handleTechnicianSelect(technician.id, technician.fullName);
                            }}
                        >
                            <option value="">Select Technician</option>
                            {technicians.map((technician) => (
                                <option key={technician.id} value={technician.id}>
                                    {technician.fullName} - {technician.experience} years experience
                                </option>
                            ))}
                        </select>
                        <div className="dialog-actions">
                            <button onClick={() => setShowDialog(false)} className="notreject-btn">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationTab;

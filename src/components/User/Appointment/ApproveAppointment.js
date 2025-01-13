import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ApproveAppointment.css";

const ApproveAppointment = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const businessServiceId = 3; // Assuming this value is passed or determined by the context of the business

    // Fetch appointment requests
    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const response = await axios.get(`http://localhost:5196/api/Appointment/pending/${businessServiceId}`);

                if (response.status === 200) {
                    setAppointments(response.data);
                    setLoading(false);
                } else {
                    throw new Error("Failed to fetch appointments");
                }
            } catch (error) {
                console.error("Error fetching appointments:", error);
                alert("An error occurred while fetching appointments. Please check the console for more details.");
                setLoading(false);
            }
        };

        fetchAppointments();
    }, [businessServiceId]);

    // Handle approve/reject actions
    const handleAction = async (appointmentId, isApproved) => {
        try {
            const response = await axios.post("http://localhost:5196/api/Appointment/approve", {
                AppointmentId: appointmentId, // Pass the appointmentId directly
                IsApproved: isApproved,
            });

            if (response.status === 200) {
                // After the action (approve/reject), filter the current list by appointmentId
                const updatedAppointments = appointments.filter((appt) => appt.appointmentId !== appointmentId);
                setAppointments(updatedAppointments);
                alert(`Appointment ${isApproved ? "approved" : "rejected"} successfully.`);
            } else {
                alert("An error occurred while processing the action.");
            }
        } catch (error) {
            console.error("Error handling appointment action:", error);
            alert(`Error: ${error.response ? error.response.data : "Unknown error"}`);
        }
    };

    // Fetch appointment status
    const fetchStatus = async (appointmentId) => {
        try {
            const response = await axios.get(`http://localhost:5196/api/Appointment/status/${appointmentId}`);
            return response.data.status;
        } catch (error) {
            console.error("Error fetching appointment status:", error);
            alert("An error occurred while fetching the status.");
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="appointment-approval-container">
            <h2>Appointment Requests</h2>
            {appointments.length > 0 ? (
                <div className="appointments">
                    {appointments.map((appointment) => (
                        <div className="appointment-card" key={appointment.appointmentId}>
                            <h4>{appointment.userName}</h4>
                            <p>{appointment.serviceName}</p>
                            <p>
                                Date: {appointment.appointmentDate}, Time: {appointment.appointmentTime}
                            </p>
                            <p>{appointment.notificationMessage}</p>
                            <button
                                onClick={() => handleAction(appointment.appointmentId, true)}
                                className="approve-btn"
                            >
                                Approve
                            </button>
                            <button
                                onClick={() => handleAction(appointment.appointmentId, false)}
                                className="reject-btn"
                            >
                                Reject
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <div>No pending appointments</div>
            )}
        </div>
    );
};

export default ApproveAppointment;


// import React, { useEffect, useState } from "react";
// import "./ApproveAppointment.css";
// import axios from "axios";

// const ApproveAppointment = () => {
//     const [appointments, setAppointments] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const businessServiceId = 3; // Assuming this value is passed or determined by the context of the business

//     // Fetch appointment requests
//     useEffect(() => {
//         const fetchAppointments = async () => {
//             try {
//                 const response = await axios.get(http://localhost:5196/api/Appointment/pending/${businessServiceId}); // Replace with your API endpoint

//                 if (response.status === 200) {
//                     setAppointments(response.data);
//                     setLoading(false);
//                 } else {
//                     throw new Error("Failed to fetch appointments");
//                 }
//             } catch (error) {
//                 console.error("Error fetching appointments:", error);
//                 alert("An error occurred while fetching appointments. Please check the console for more details.");
//                 setLoading(false);
//             }
//         };

//         fetchAppointments();
//     }, [businessServiceId]);

//     // Handle approve/reject actions
//     const handleAction = async (appointmentId, isApproved) => {
//         try {
//             const response = await axios.post("http://localhost:5196/api/Appointment/approve", {
//                 AppointmentId: appointmentId, // Pass the appointmentId directly
//                 IsApproved: isApproved,
//             });

//             if (response.status === 200) {
//                 // After the action (approve/reject), filter the current list by appointmentId
//                 const updatedAppointments = appointments.filter((appt) => appt.id !== appointmentId);
//                 setAppointments(updatedAppointments);
//                 alert(Appointment ${isApproved ? "approved" : "rejected"} successfully.);
//             } else {
//                 alert("An error occurred while processing the action.");
//             }
//         } catch (error) {
//             console.error("Error handling appointment action:", error);
//             alert(Error: ${error.response ? error.response.data : "Unknown error"});
//         }
//     };

//     // Fetch appointment status
//     const fetchStatus = async (appointmentId) => {
//         try {
//             const response = await axios.get(http://localhost:5196/api/Appointment/status/${appointmentId});
//             const data = await response.data;
//             alert(The current status of this appointment is: ${data.status});
//         } catch (error) {
//             console.error("Error fetching appointment status:", error);
//             alert("Error fetching status. Please check the console for more details.");
//         }
//     };

//     if (loading) {
//         return <p className="loading-text">Loading appointments...</p>;
//     }

//     if (appointments.length === 0) {
//         return <p className="no-appointments-text">No pending appointments.</p>;
//     }

//     return (
//         <div className="appointments-container">
//             {appointments.map((appointment) => (
//                 <div key={appointment.id} className="appointment-card">
//                     <p className="service-name"><strong>Service:</strong> {appointment.appointmentId}</p>
//                     {/* {console.log("appointmentid"+appointmentId)} */}
//                     <p className="user-name"><strong>Customer:</strong> {appointment.userName}</p>
//                     <p className="appointment-date"><strong>Date:</strong> {appointment.appointmentDate}</p>
//                     <p className="appointment-time"><strong>Time:</strong> {appointment.appointmentTime}</p>
//                     <div className="actions-container">
//                         <button
//                             className="approve-btn"
//                             onClick={() => handleAction(appointment.id, true)} // Passing the appointment ID here
//                         >
//                             Approve
//                         </button>
//                         <button
//                             className="reject-btn"
//                             onClick={() => handleAction(appointment.id, false)} // Passing the appointment ID here
//                         >
//                             Reject
//                         </button>
//                         <button
//                             className="status-btn"
//                             onClick={() => fetchStatus(appointment.id)} // Now defined properly
//                         >
//                             Check Status
//                         </button>
//                     </div>
//                 </div>
//             ))}
//         </div>
//     );
// };

// export default ApproveAppointment;
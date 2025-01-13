import React, { useState, useEffect } from "react";
import axios from "axios";
import InsertService from "./InsertService"; // Import InsertService component
import './ViewService.css';

const ViewService = () => {
    const [services, setServices] = useState([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false); // State to control dialog visibility

    useEffect(() => {
        fetchServices();
    }, [services]);

    const fetchServices = async () => {
        try {
            const response = await axios.get("http://localhost:5196/api/Service");
            setServices(response.data);
        } catch (error) {
            console.error("Error fetching services:", error);
        }
    };

    const openDialog = () => {
        setIsDialogOpen(true); // Open the dialog
    };

    const closeDialog = () => {
        setIsDialogOpen(false); // Close the dialog
    };

    return (
        <div className="service-container">
            <h1 className="vs-h1">Service Management</h1>
            <button onClick={openDialog} className="insert-subcategory-btn">
                Add Service
            </button>

            <div className="service-grid">
                {services.map((service) => (
                    <div key={service.id} className="technician-card">
                        <div className="technician-header">
                            <p><strong className="tech-strong">Name: </strong>{service.name}</p>
                            <p><strong className="tech-strong">Description: </strong>{service.description}</p>
                        </div>
                    </div>
                ))}
            </div>

            {isDialogOpen && (
                <>
                    <div className="overlay" onClick={closeDialog}></div>
                    <InsertService
                        onClose={closeDialog}           // Close dialog when requested
                        onServiceAdded={fetchServices}  // Refresh services after adding a new one
                    />
                </>
            )}
        </div>
    );
};

export default ViewService;

import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./InsertTechnician.css";

const InsertTechnician = ({onClose}) => {

   
    const navigate = useNavigate();
    const [newTechnician, setNewTechnician] = useState({
        fullName: "",
        experience: "",
        businessServiceId: "",
    });
    const [businessServices, setBusinessServices] = useState([]);
    const [message, setMessage] = useState("");
    const businessId = localStorage.getItem("businessId");
    const [showInsert, setShowInsert] = useState(true); // State to control dialog visibility
    const handleCloseDialog = () => {
        setShowInsert(false);
        if (onClose) onClose(); // Close the dialog by calling onClose if it's passed as a prop
    };
    useEffect(() => {
        fetchBusinessService();
    }, []);

    const fetchBusinessService = async () => {
        try {
            const response = await axios.get(`http://localhost:5196/api/BusinessService/Business/${businessId}`);
            setBusinessServices(response.data);
        } catch (error) {
            console.error("Error fetching business services:", error);
        }
    };

    // Handle input changes
    const handleInputChange = (e) => {
        setNewTechnician({
            ...newTechnician,
            [e.target.name]: e.target.value
        });
    };

    // Validate form inputs before submission
    const validateForm = () => {
        if (!newTechnician.fullName || !newTechnician.experience || !newTechnician.businessServiceId) {
            setMessage("Please fill all fields.");
            return false;
        }
        return true;
    };

    // Handle request submission
    const handleSubmitRequest = async () => {
        if (!validateForm()) return;

        const data = {
            fullName: newTechnician.fullName,
            experience: newTechnician.experience,
            businessServiceId: newTechnician.businessServiceId,
        };

        try {
            await axios.post("http://localhost:5196/api/Technician", data);
            setNewTechnician({ fullName: "", experience: "", businessServiceId: "" });
            alert('Technician added successfully');
            setShowInsert(false);
            if (onClose) onClose();
        } catch (error) {
            console.error("Error submitting request:", error);
            setMessage("Error adding technician. Please try again.");
        }
    };

    return (
        <div className="technician-container">
            <h1>Add Technician</h1>
            <form onSubmit={(e) => e.preventDefault()}>
                <label>Full Name:</label>
                <input
                    type="text"
                    name="fullName"
                    value={newTechnician.fullName}
                    onChange={handleInputChange}
                    placeholder="Enter full name"
                />

                <label>Experience:</label>
                <textarea
                    name="experience"
                    value={newTechnician.experience}
                    onChange={handleInputChange}
                    placeholder="Enter experience"
                />

                <label>Services:</label>
                <select
                    name="businessServiceId"
                    value={newTechnician.businessServiceId}
                    onChange={(e) => {
                        if (e.target.value === "add") {
                            navigate("/InsertBusinessService"); // Navigate to Add Category
                            return; // Prevent form submission after navigation
                        }
                        handleInputChange(e);
                    }}
                >
                    <option value="">Select Service</option>
                    {businessServices.map((businessService) =>
                        businessService.isActive ? (
                            <option key={businessService.id} value={businessService.id}>
                                {businessService.service.name}
                            </option>
                        ) : null
                    )}
                    <option value="add"> Add New Business Service</option>
                </select>

                <div className="button-container" style={{ flexDirection: 'row' }}>
                    <button type="button" onClick={handleSubmitRequest} className="insert-btn">
                        Add
                    </button>

                    <button type="button" onClick={handleCloseDialog} className="cancel-btn">
                        Cancel
                    </button>
                </div>

                {/* {message && (
                    <p className={`message ${message.includes("successfully") ? "success" : "error"}`}>
                        {message}
                    </p>
                )} */}
            </form>
        </div>
    );
};

export default InsertTechnician;

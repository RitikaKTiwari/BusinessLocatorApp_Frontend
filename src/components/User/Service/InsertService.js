import axios from 'axios';
import React, { useState, useEffect } from 'react';
import './InsertService.css';

const InsertService = ({ onClose, onServiceAdded }) => {
    const [newService, setNewService] = useState({ name: "", description: "", subcategoryId: "" });
    const [subcategories, setSubCategories] = useState([]);
    const [message, setMessage] = useState("");

    useEffect(() => {
        fetchSubCategories();
    }, []);

    const fetchSubCategories = async () => {
        try {
            const response = await axios.get("http://localhost:5196/api/SubCategory");
            setSubCategories(response.data);
        } catch (error) {
            console.error("Error fetching subcategories:", error);
        }
    };

    const handleInputChange = (e) => {
        setNewService({ ...newService, [e.target.name]: e.target.value });
    };

    const handleInsert = async () => {
        const data = {
            businessId: localStorage.getItem("businessId"),
            name: newService.name,
            description: newService.description,
            subCategoryId: newService.subcategoryId,
            adminComments: "Pending approval", // Default admin comments
        };
        try {
            await axios.post("http://localhost:5196/api/ServiceRequest/submit", data);
            setMessage("Your request has been submitted. Please wait for admin approval.");
            alert("Request successfully submitted! Wait for admin approval.");
            onServiceAdded();  // Call the parent function to refresh services list
            onClose();  // Close the dialog
        } catch (error) {
            console.error("Error submitting request:", error);
            setMessage("Error submitting your request. Please try again.");
        }
    };

    return (
        <div className="modal-overlay">
            <div className="container">
                <h1>Submit Request for New Service</h1>
                <form className="service-form" onSubmit={(e) => e.preventDefault()}>
                    <label>Name:</label>
                    <input
                        type="text"
                        style={{width:'90%'}}
                        name="name"
                        value={newService.name}
                        onChange={handleInputChange}
                    />

                    <label>Description:</label>
                    <textarea
                        name="description"
                        style={{width:'90%'}}
                        value={newService.description}
                        onChange={handleInputChange}
                    />

                    <label>Subcategory:</label>
                    <select
                        name="subcategoryId"
                        style={{width:'90%'}}
                        value={newService.subcategoryId}
                        onChange={handleInputChange}
                    >
                        <option value="">Select Subcategory</option>
                        {subcategories.map((subcategory) =>
                            subcategory.isActive ? (
                                <option key={subcategory.id} value={subcategory.id}>
                                    {subcategory.name}
                                </option>
                            ) : null
                        )}
                    </select>
                    <div className="button-container">
                    <button type="button" onClick={handleInsert} className="insert-btn">Insert Service</button>
                    <button type="button" onClick={onClose} className="cancel-btn">Cancel</button>
                </div>

                {message && (
                    <p className={`message ${message.includes("successfully") ? "success" : "error"}`}>
                        {message}
                    </p>
                )}
            </form>
                   
            </div>
        </div>
    );
};

export default InsertService;

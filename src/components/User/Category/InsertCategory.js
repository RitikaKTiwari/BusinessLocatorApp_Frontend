import React, { useState } from "react";
import axios from "axios";
import './InsertCategory.css';

const InsertCategory = ({ onClose, onCategoryAdded }) => {
    const [name, setName] = useState(""); // Name of the category
    const [message, setMessage] = useState(""); // Success/Error message
    const [showInsert, setShowInsert] = useState(true); // State to control dialog visibility

    const handleCloseDialog = () => {
        setShowInsert(false);
        if (onClose) onClose(); // Close the dialog by calling onClose if it's passed as a prop
    };

    const handleSubmitRequest = async () => {
        const data = {
            businessId: localStorage.getItem("businessId"),
            name: name.trim(),
            adminComments: "Pending approval", // Default admin comment
        };

        try {
            await axios.post("http://localhost:5196/api/CategoryRequest/submit", data);
            setName(""); // Clear the form field
            setMessage("Your request has been sent. Please wait for admin approval.");
            alert("Your request has been submitted successfully! Wait for admin approval.");
            setShowInsert(false); // Hide the form after submission
            if (onCategoryAdded) onCategoryAdded(); // Refresh categories after adding
            if (onClose) onClose(); // Close the dialog
        } catch (error) {
            console.error("Error submitting request:", error);
            setMessage("Error submitting your request. Please try again.");
        }
    };

    if (!showInsert) return null; // Return null if the dialog should be hidden

    return (
        <>
          {/* Overlay background for blur effect */}
          {/* <div className="overlay"></div> */}
        <div className="insert-category-container">
            <h1>Submit Request for New Category</h1>
            <form className="insert-category-form" onSubmit={(e) => e.preventDefault()}>
                <input
                    type="text"
                    placeholder="Enter Category Name"
                    style={{width:'90%'}}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <div className="button-container">
                    <button type="button" onClick={handleSubmitRequest} className="insert-btn">Submit Request</button>
                    <button type="button" onClick={handleCloseDialog} className="cancel-btn">Cancel</button>
                </div>

                {message && (
                    <p className={`message ${message.includes("successfully") ? "success" : "error"}`}>
                        {message}
                    </p>
                )}
            </form>
        </div>
        </>
    );
};

export default InsertCategory;

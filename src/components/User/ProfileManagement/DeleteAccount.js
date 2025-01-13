import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Logout.css";
import axios from "axios";

const DeleteAccount = ({ onClose }) => {
    const [showDeleteBox, setShowDeleteBox] = useState(true);
    const navigate = useNavigate();

    const userId = localStorage.getItem('userId');
    const businessId = localStorage.getItem('businessId');

    const handleDelete = async () => {
        if (userId) {
            await axios.delete(`http://localhost:5196/api/User/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                }
            });
            alert("User deactivated successfully");
        }
        else if (businessId) {
            await axios.delete(`http://localhost:5196/api/User/${businessId}`);
            alert("Business deactivated successfully");
        }
        else {
            alert('You are not loggedIn!! Kingly login');
        }
        localStorage.clear(); // Clear local storage
        setShowDeleteBox(false);
        navigate("/Login"); // Redirect to Login
        onClose(); // Notify parent to close the dialog
    };

    const closeDelete = () => {
        setShowDeleteBox(false);
        onClose(); // Notify parent to close the dialog
    };

    return (
        <>
            {showDeleteBox && (
                <div className="logout-overlay">
                    <div className="logout-box">
                        <h3>Confirm Delete</h3>
                        <p>Are you sure you want to delete your account?</p>
                        <div className="logout-actions">
                            <button className="confirm-button" onClick={handleDelete}>
                                Yes, Delete
                            </button>
                            <button className="cancel-button" onClick={closeDelete}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default DeleteAccount;
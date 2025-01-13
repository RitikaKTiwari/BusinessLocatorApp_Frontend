import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./DeleteDialogComponent.css";
import axios from 'axios';

const DeleteDialogComponent = ({ onClose, setMe, techid, businessserviceid }) => {
    const [showDeleteBox, setShowDeleteBox] = useState(true);
    const navigate = useNavigate();

    const handleDelete = async () => {
        if (setMe == 1) {
            await axios.delete(`http://localhost:5196/api/Technician/${techid}`);
            alert("Succesfully Deleted");
        }
        else if (setMe == 2) {
            await axios.delete(`http://localhost:5196/api/BusinessService/${businessserviceid}`);
            alert("Succesfully Deleted");
        }
        setShowDeleteBox(false);
        onClose();
    };

    const closeDeleteBox = () => {
        setShowDeleteBox(false);
        onClose();
    };

    return (
        <>
            {showDeleteBox && (
                <div className="delete-overlay">
                    <div className="delete-box">
                        <h3>Confirm Delete</h3>
                        <p>Are you sure you want to delete?</p>
                        <div className="delete-actions">
                            <button className="delete-confirm-button" onClick={handleDelete}>
                                Confirm Delete
                            </button>
                            <button className="delete-cancel-button" onClick={closeDeleteBox}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default DeleteDialogComponent;

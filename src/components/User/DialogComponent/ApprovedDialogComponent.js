import React, { useState, useEffect } from "react";
import check from '../../image/checkmark.png'; // Common success image
import reject from '../../image/remove.png'; // Rejected image
import "./ApprovedDialogComponent.css";

const ApprovedDialogComponent = ({ onClose, message }) => {
    const [showApprovedBox, setShowApprovedBox] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowApprovedBox(false);
            if (onClose) onClose(); // Call onClose after 3 seconds
        }, 3000);

        // Cleanup the timer when the component is unmounted
        return () => clearTimeout(timer);
    }, [onClose]);

    // Determine the text to display based on the message prop
    const getMessageText = () => {
        switch (message) {
            case "Approve":
                return "Successfully Approved";
            case "Reject":
                return "Rejected";
            case "Update":
                return "Successfully Updated";
            case "Insert":
                return "Successfully Inserted";
            case "Book":
                return "Appointment Booked Successfully";
            case "Address":
                return "Address Updated Successfully";
                case "Login":
                return "Logged-In Successfully";
            case "Delete":
                return "Successfully Deleted";
            default:
                return "Operation Successful";
        }
    };

    return (
        <>
            {showApprovedBox && (
                <div className="approved-overlay">
                    <div className="approved-box">
                        <img
                            src={message === "Reject" ? reject : check}
                            alt={message === "Reject" ? "Rejected Icon" : "Success Icon"}
                            className="approved-image"
                        />
                        <label className="approved-text">{getMessageText()}</label>
                    </div>
                </div>
            )}
        </>
    );
};

export default ApprovedDialogComponent;

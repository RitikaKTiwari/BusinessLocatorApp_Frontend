import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./OverviewTab.css"; // Ensure this file contains the provided CSS
import Logout from "../Logout";

const OverviewTab = ({ businessId }) => {
    const [business, setBusiness] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBusinessProfile = async () => {
            try {
                const response = await axios.get(`http://localhost:5196/api/Business/${businessId}`);
                setBusiness(response.data);
                setLoading(false);
            } catch (error) {
                setError("Failed to fetch business profile.");
                setLoading(false);
            }
        };

        fetchBusinessProfile();
    }, [businessId]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    const openLogoutDialog = () => {
        setLogoutDialogOpen(true); // Open the logout dialog
    };

    const closeLogoutDialog = () => {
        setLogoutDialogOpen(false); // Close the logout dialog
    };

    return (
        <div className="view-profile">
            {/* <div className="profile-picture-container">
                <img
                    src={business?.profilePicture || "/default-profile.png"}
                    alt={`${business?.name}'s Profile`}
                    className="profile-picture"
                />
                <button className="edit-icon">
                    <img src="/edit-icon.png" alt="Edit Profile" />
                </button>
            </div> */}
            <h2>{business?.name}</h2>
            <div>
                <p>
                    <strong>Email:</strong> {business?.email}
                </p>
                <p>
                    <strong>Description:</strong> {business?.description}
                </p>
                <p>
                    <strong>Contact No:</strong> {business?.contactNo}
                </p>
                <div >
                    <h3>Address</h3>
                    <p>
                        {business?.address?.street}, {business?.address?.location}
                    </p>
                    <p>
                        <strong>Latitude:</strong> {business?.address?.latitude}
                    </p>
                    <p>
                        <strong>Longitude:</strong> {business?.address?.longitude}
                    </p>
                    <p>
                        <strong>Primary Address:</strong> {business?.address?.isPrimary ? "Yes" : "No"}
                    </p>
                </div>
            </div>
            <div className="button-group">
                <button className="update-profile-btn" onClick={() => { navigate("/UpdateBusinessProfile") }}>Update Profile</button>
                {logoutDialogOpen && <Logout onClose={closeLogoutDialog} />}

            </div>
        </div>
    );
};

export default OverviewTab;

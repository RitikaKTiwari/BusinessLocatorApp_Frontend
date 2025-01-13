import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../UserProfileManagement/UpdateProfile.css"; // Ensure this file has appropriate styling
import Header from '../../Header/Header'
import Footer from '../../Footer/Footer'
import ApprovedDialogComponent from '../../../User/DialogComponent/ApprovedDialogComponent';

const UpdateBusinessProfile = () => {
    const businessId = localStorage.getItem("businessId");
    const [business, setBusiness] = useState({
        name: "",
        email: "",
        description: "",
        password: "",
        contactNo: "",
        address: {
            street: "",
            location: "",
            latitude: "",
            longitude: "",
            isPrimary: false,
        },
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
          const [approvedDialogOpen, setApprovedDialogOpen] = useState(false);
          const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const fetchBusinessDetails = async () => {
        try {
            const response = await axios.get(`http://localhost:5196/api/Business/${businessId}`);
            setBusiness(response.data);
            setLoading(false);
        } catch (error) {
            setError("Failed to fetch business details.");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBusinessDetails();
    }, []); // Add an empty dependency array to avoid infinite fetching

    const handleChange = (e) => {
        const { name, value } = e.target;
        setBusiness((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        setBusiness((prev) => ({
            ...prev,
            address: {
                ...prev.address,
                [name]: name === "isPrimary" ? value === "Yes" : value,
            },
        }));
    };

    const openDialog = () => {
        setApprovedDialogOpen(true);
      };
    
      const closeDialog = () => {
        setApprovedDialogOpen(false);
        navigate('/ViewBusinessProfile');

      };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:5196/api/Business/${businessId}`, business);
            setMessage("Update");
            openDialog(); 
                       // navigate(-1); // Redirect back to the overview page
        } catch (error) {
            alert("Failed to update profile. Please try again.");
            console.error("Error updating profile:", error);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <>
        <header><Header></Header></header>
        <div className="update-profile">
            <h2>Update Business Profile</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="name">Business Name</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={business.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="text"
                        id="email"
                        name="email"
                        value={business.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea
                        id="description"
                        name="description"
                        value={business.description}
                        onChange={handleChange}
                        rows="4"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="contactNo">Contact No</label>
                    <input
                        type="text"
                        id="contactNo"
                        name="contactNo"
                        value={business.contactNo}
                        onChange={handleChange}
                        required
                    />
                </div>
                {/* <h3>Address</h3>
                <div className="form-group">
                    <label htmlFor="street">Street</label>
                    <input
                        type="text"
                        id="street"
                        name="street"
                        value={business.address.street}
                        onChange={handleAddressChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="location">Location</label>
                    <input
                        type="text"
                        id="location"
                        name="location"
                        value={business.address.location}
                        onChange={handleAddressChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="latitude">Latitude</label>
                    <input
                        type="text"
                        id="latitude"
                        name="latitude"
                        value={business.address.latitude}
                        onChange={handleAddressChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="longitude">Longitude</label>
                    <input
                        type="text"
                        id="longitude"
                        name="longitude"
                        value={business.address.longitude}
                        onChange={handleAddressChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="isPrimary">Primary Address</label>
                    <select
                        id="isPrimary"
                        name="isPrimary"
                        value={business.address.isPrimary ? "Yes" : "No"}
                        onChange={handleAddressChange}
                        required
                    >
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                    </select>
                </div> */}
                <div className="button-group">
                    <button type="submit" className="save-button">
                        Save Changes
                    </button>
                    <button
                        type="button"
                        className="cancel-button"
                        onClick={() => navigate(-1)}
                    >
                        Cancel
                    </button>
                </div>
                {approvedDialogOpen && <ApprovedDialogComponent onClose={closeDialog} message={message} />}
            </form>
        </div>
        <footer>
            <Footer></Footer>
        </footer>
        </>
    );
};

export default UpdateBusinessProfile;

import React, { useEffect, useState } from 'react';
import './UpdateProfile.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import ApprovedDialogComponent from '../../../User/DialogComponent/ApprovedDialogComponent';


const UpdateProfile = () => {
    const navigate = useNavigate();
    const [userId, setUserId] = useState(null);
      const [approvedDialogOpen, setApprovedDialogOpen] = useState(false);
      const [message, setMessage] = useState("");
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        contactNumber: '',
    });
    const [error, setError] = useState('');
    const openDialog = () => {
        setApprovedDialogOpen(true);
      };
    
      const closeDialog = () => {
        setApprovedDialogOpen(false);
        navigate('/ViewProfile');

      };
    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token) {
            navigate('/login'); // Redirect if token not found
        } else {
            const decodedToken = jwtDecode(token);
            const userIdFromToken = decodedToken.UserId; // Use the correct claim key for UserId
            setUserId(userIdFromToken);

            // Fetch the user data here to prefill the form
            fetchUserData(userIdFromToken);
        }
    }, [navigate]);

    const fetchUserData = async (userId) => {
        try {
            const response = await axios.get(`http://localhost:5196/api/User/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (response.data) {
                setFormData({
                    firstName: response.data.firstName || '',
                    lastName: response.data.lastName || '',
                    email: response.data.email || '',
                    contactNumber: response.data.contactNo || '',
                });
            }
        } catch (error) {
            setError('Failed to fetch user data. Please try again.');
            console.error('Fetch user data error:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSaveChanges = async (e) => {
        e.preventDefault(); // Prevent form submission on button click

        if (!userId) {
            setError('User ID not found.');
            return;
        }

        try {
            const response = await axios.put(`http://localhost:5196/api/User/${userId}`, {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                contactNo: formData.contactNumber,
            },
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                });

            if (response.data) {
                setMessage("Update");
                openDialog();      
            }
        } catch (error) {
            setError('Profile update failed. Please try again.');
            console.error('Update error:', error);
        }
    };

    const goback = () => {
        navigate('/ViewProfile');
    };

    return (
        <div className="update-profile">
            <h2>UPDATE PROFILE</h2>
            <form>
                <div className="form-group">
                    <label className="form-label">
                        First Name
                        <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            required
                            className="input-field"
                            onChange={handleInputChange}
                        />
                    </label>
                </div>
                <div className="form-group">
                    <label className="form-label">
                        Last Name
                        <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            required
                            className="input-field"
                            onChange={handleInputChange}
                        />
                    </label>
                </div>
                <div className="form-group">
                    <label className="form-label">
                        Email
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            required
                            className="input-field"
                            onChange={handleInputChange}
                        />
                    </label>
                </div>
                <div className="form-group">
                    <label className="form-label">
                        Contact Number
                        <input
                            type="tel"
                            name="contactNumber"
                            value={formData.contactNumber}
                            required
                            className="input-field"
                            onChange={handleInputChange}
                        />
                    </label>
                </div>
            </form>
            {error && <div style={{ color: 'red', textAlign: 'center' }}>{error}</div>}
            <div className="button-group">
                <button className="back-btn" onClick={goback}>
                    Back
                </button>
                <button className="save-btn" onClick={handleSaveChanges}>
                    Save Changes
                </button>
            </div>
            {approvedDialogOpen && <ApprovedDialogComponent onClose={closeDialog} message={message} />}

        </div>
    );
};

export default UpdateProfile;

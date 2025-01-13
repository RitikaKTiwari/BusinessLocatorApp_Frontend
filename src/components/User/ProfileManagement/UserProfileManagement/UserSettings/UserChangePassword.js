import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import './UserChangePassword.css'; // Your custom CSS file

const UserChangePassword = () => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const userId = localStorage.getItem("userId");
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            setMessage('Unauthorized access.');
            return;
        }

        const fetchOldPassword = async () => {
            try {
                const response = await axios.get('http://localhost:5196/api/UserDetails/me', {
                    headers: {
                        Authorization: `Bearer ${token}` // Attach the token
                    }
                });

                setOldPassword(response.data.passwordHash); // Mask old password in input but autofill
            } catch (error) {
                setMessage('Failed to fetch old password');
            }
        };

        fetchOldPassword();
    }, [userId]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate inputs
        if (!oldPassword || !newPassword) {
            setMessage('All fields are required');
            return;
        }

        if (newPassword !== confirmPassword) {
            setMessage('New Password doesnot matches to Confirm Password');
            return;
        }

        try {
            const response = await axios.put(
                `http://localhost:5196/api/User/${userId}/update_password`,
                {
                    passwordHash: newPassword,
                }
            );

            setMessage(response.data.message);
            navigate(-1);
        } catch (error) {
            setMessage(error.response?.data?.message || 'Something went wrong!');
        }
    };

    return (
        <div className="change-password-container">
            <h2>Change Password</h2>
            <form onSubmit={handleSubmit} className="password-form">
                <div className="form-group">
                    <label>Old Password:</label>
                    <input
                        type="password"
                        value={oldPassword}
                        readOnly
                        className="input-field"
                    />
                </div>
                <div className="form-group">
                    <label>New Password:</label>
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        className="input-field"
                    />
                </div>
                <div className="form-group">
                    <label>Confirm Password:</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="input-field"
                    />
                </div>
                <button type="submit" className="submit-button">Change Password</button>
            </form>
            {message && <p className="message">{message}</p>}
        </div>
    );
};

export default UserChangePassword;

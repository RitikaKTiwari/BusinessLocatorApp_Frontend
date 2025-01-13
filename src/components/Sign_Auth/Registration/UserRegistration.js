import './Registration.css';
import React, { useState } from 'react';
import axios from 'axios'; // Import Axios
import { useNavigate } from 'react-router-dom';

const UserRegistration = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [contactNo, setContactNo] = useState('');
    const [error, setError] = useState('');
    const [fieldErrors, setFieldErrors] = useState({});
    const navigate = useNavigate();

    const validateField = (name, value) => {
        const errors = { ...fieldErrors };

        switch (name) {
            case 'firstName':
                if (!value.trim()) {
                    errors.firstName = "First Name is required.";
                } else {
                    delete errors.firstName;
                }
                break;
            case 'lastName':
                if (!value.trim()) {
                    errors.lastName = "Last Name is required.";
                } else {
                    delete errors.lastName;
                }
                break;
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!value.trim()) {
                    errors.email = "Email Address is required.";
                } else if (!emailRegex.test(value)) {
                    errors.email = "Invalid email format.";
                } else {
                    delete errors.email;
                }
                break;

            case 'password':
                if (!value) {
                    errors.password = "Password is required.";
                } else if (value.length < 8) {
                    errors.password = "Password must be at least 8 characters.";
                } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) { // Check for special characters
                    errors.password = "Password must contain at least one special character.";
                } else if (!/[A-Z]/.test(value)) { // Check for at least one uppercase letter
                    errors.password = "Password must contain at least one uppercase letter.";
                } else if (!/[0-9]/.test(value)) { // Check for at least one number
                    errors.password = "Password must contain at least one number.";
                } else {
                    delete errors.password; // Validation passed, clear the error
                }
                break;

            case 'confirmPassword':
                if (!value) {
                    errors.confirmPassword = "Confirm Password is required.";
                } else if (value !== password) {
                    errors.confirmPassword = "Passwords do not match.";
                } else {
                    delete errors.confirmPassword;
                }
                break;
            case 'contactNo':
                const phoneRegex = /^[0-9]{10}$/;
                if (!value.trim()) {
                    errors.contactNo = "Contact Number is required.";
                } else if (!phoneRegex.test(value)) {
                    errors.contactNo = "Contact Number must be a valid 10-digit number.";
                } else {
                    delete errors.contactNo;
                }
                break;
            default:
                break;
        }

        setFieldErrors(errors);
    };

    const validateFields = () => {
        validateField('firstName', firstName);
        validateField('lastName', lastName);
        validateField('email', email);
        validateField('password', password);
        validateField('confirmPassword', confirmPassword);
        validateField('contactNo', contactNo);

        return Object.keys(fieldErrors).length === 0;
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        if (!validateFields()) {
            return;
        }

        try {
            const response = await axios.post('http://localhost:5196/api/UserAuth/register', {
                firstName,
                lastName,
                email,
                password,
                contactNo,
            });

            if (response.data.success) {
                alert('Registration successful!');
                navigate('/Login');
            } else {
                setError(response.data.message);
            }
        } catch (error) {
            setError('Registration failed. Please try again.');
            console.error("Registration error:", error);
        }
    };

    const handleFirstNameChange = (e) => {
        const value = e.target.value.replace(/[^a-zA-Z]/g, ''); // Only allows alphabets
        setFirstName(value);
        validateField('firstName', value);
    };

    const handleLastNameChange = (e) => {
        const value = e.target.value.replace(/[^a-zA-Z]/g, ''); // Only allows alphabets
        setLastName(value);
        validateField('lastName', value);
    };

    const handleContactNoChange = (e) => {
        const value = e.target.value.replace(/[^0-9]/g, ''); // Only allows numbers
        setContactNo(value);
        validateField('contactNo', value);
    };

    return (
        <div className="center-container">
            <div className="signbox">
                <h1 className="title">Create Your Account</h1>
                <p className="subtitle">
                    Fill out the details below to get started with your new account.
                </p>
                <form onSubmit={handleRegister}>
                    {/* Input fields in two columns */}
                    <div className="input-section">
                        <div className="input-column">
                            <div className="form-group">
                                <label htmlFor="firstName">First Name</label>
                                <input
                                    id="firstName"
                                    type="text"
                                    value={firstName}
                                    onChange={handleFirstNameChange}
                                    placeholder="Enter your first name"
                                    required
                                    className="input-fieldd"
                                />
                                {fieldErrors.firstName && <div className="error-message">{fieldErrors.firstName}</div>}
                            </div>
                            <div className="form-group">
                                <label htmlFor="lastName">Last Name</label>
                                <input
                                    id="lastName"
                                    type="text"
                                    value={lastName}
                                    onChange={handleLastNameChange}
                                    placeholder="Enter your last name"
                                    required
                                    className="input-fieldd"
                                />
                                {fieldErrors.lastName && <div className="error-message">{fieldErrors.lastName}</div>}
                            </div>
                            <div className="form-group">
                                <label htmlFor="email">Email Address</label>
                                <input
                                    id="email"
                                    type="text"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        validateField('email', e.target.value);
                                    }}
                                    placeholder="Enter your email address"
                                    required
                                    className="input-fieldd"
                                />
                                {fieldErrors.email && <div className="error-message">{fieldErrors.email}</div>}
                            </div>
                        </div>
                        <div className="input-column">
                            <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        validateField('password', e.target.value);
                                    }}
                                    placeholder="Create a password"
                                    required
                                    className="input-fieldd-new"
                                />
                                {fieldErrors.password && <div className="error-message">{fieldErrors.password}</div>}
                            </div>
                            <div className="form-group">
                                <label htmlFor="confirmPassword">Confirm Password</label>
                                <input
                                    id="confirmPassword"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => {
                                        setConfirmPassword(e.target.value);
                                        validateField('confirmPassword', e.target.value);
                                    }}
                                    placeholder="Confirm your password"
                                    required
                                    className="input-fieldd-new"
                                />
                                {fieldErrors.confirmPassword && <div className="error-message">{fieldErrors.confirmPassword}</div>}
                            </div>
                            <div className="form-group">
                                <label htmlFor="contactNo">Contact Number</label>
                                <input
                                    id="contactNo"
                                    type="text"
                                    value={contactNo}
                                    onChange={handleContactNoChange}
                                    placeholder="Enter your contact number"
                                    required
                                    className="input-fieldd-new"
                                />
                                {fieldErrors.contactNo && <div className="error-message">{fieldErrors.contactNo}</div>}
                            </div>
                        </div>
                    </div>
                    <div className="buttonreg-section">
                        <button type="submit" className="insert-btn">Register</button>
                        <button
                            type="button"
                            className="cancel-btn"
                            onClick={() => navigate(-1)}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserRegistration;
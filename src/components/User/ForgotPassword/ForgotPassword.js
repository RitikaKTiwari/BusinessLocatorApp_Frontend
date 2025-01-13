import React, { useState } from 'react';
import axios from 'axios';
import './ForgotPassword.css';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email) {
            setMessage('Please enter your email address');
            return;
        }

        setIsLoading(true);

        try {
            const response = await axios.post('http://localhost:5196/api/User/forgot-password', {
                email, // Sending the email in the request body
            });

            setMessage(response.data.message || 'A reset link has been sent to your email.');
        } catch (error) {
            if (error.response) {
                // Server responded with a status other than 2xx
                setMessage(error.response.data.message || 'Something went wrong. Please try again.');
            } else {
                // Network error or no response
                setMessage('Failed to send reset link. Please try again later.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="forgot-password-container">
            <div className="forgot-password-box">
                <h2>Forgot Password?</h2>
                <p className="forgot-password-subtext">Enter your email address and we'll send you a link to reset your password.</p>
                
                {message && <div className="message">{message}</div>}

                <form className="forgot-password-form" onSubmit={handleSubmit}>
                    <input
                        type="email"
                        placeholder="Email Address"
                        value={email}
                        onChange={handleEmailChange}
                        className="input-field"
                        required
                    />
                    <button type="submit" className="submit-btn" disabled={isLoading}>
                        {isLoading ? 'Sending...' : 'Send Reset Link'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;
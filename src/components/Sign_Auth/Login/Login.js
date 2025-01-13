import React, { useState } from "react";
import "./Login.css";
import InputField from "../../Reusable/InputField";
import log_side from "../../image/pinkbg.jpg";
import or from "../../image/or.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [forgotEmail, setForgotEmail] = useState("");
  const [message, setMessage] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  function handleRegister() {
    navigate("/UserRegistration");
  }
  // Handle regular login
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }

    try {
      let response = await axios.post(
        "http://localhost:5196/api/UserAuth/login",
        {
          email,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        const userRole = response.data.role;
        localStorage.setItem("userId", response.data.id);

        if (userRole === "Admin") {
          navigate("/AdminMain");
        } else {
          navigate("/");
        }

       // alert("Login successful!");
      }
    } catch (error) {
      try {
        let response = await axios.post(
          "http://localhost:5196/api/UserAuth/business/login",
          {
            email,
            password,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data.token) {
          localStorage.setItem("token", response.data.token);
          const userRole = response.data.role;

          if (userRole === "Business") {
            localStorage.setItem("businessId", response.data.id);
            navigate("/BusinessMain");
          }

          //alert("Login successful!");
        } else {
          setError("Invalid email or password");
        }
      } catch (error) {
        if (error.response && error.response.data.message) {
          setError(error.response.data.message);
        } else {
          setError("Failed to login. Please check your credentials.");
        }
      }
    }
  };

  // Handle forgot password
  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5196/api/User/forgot-password",
        {
          email: forgotEmail,
        }
      );
      setMessage(response.data.message);
      setShowForgotPassword(false);
      setMessage("");
    } catch (error) {
      console.error("Forgot password error:", error);
      setMessage("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Google Login Success
  const handleGoogleLoginSuccess = async (credentialResponse) => {
    const tokenId = credentialResponse.credential;
    //console.log(tokenId)
    try {
      const response = await axios.post(
        "http://localhost:5196/api/UserAuth/google-login",
        {
          tokenId,
        }
      );
      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        const userRole = response.data.role;
        const userId = response.data.userId;
        localStorage.setItem("userId", userId);
        console.log("Login successful! User ID:", response.data);

        if (userRole === "Admin") {
          navigate("/AdminMain");
        } else if (userRole === "Business") {
          navigate("/BusinessMain");
        } else {
          navigate("/");
        }
       // alert("Google Login successful!");
      } else {
        alert("Google Login failed!");
      }
    } catch (error) {
      console.error("Google Login error:", error);
      alert("An error occurred during Google Login. Please try again.");
    }
  };

  // Close forgot password modal
  const handleCloseForgotPassword = () => {
    setShowForgotPassword(false);
    setMessage("");
  };

  return (
    <GoogleOAuthProvider clientId="681829799975-f4sud3i9ie37vib3h5jbm4sr9tfvitfu.apps.googleusercontent.com">
      <div className="app-container">
        <div
          className={`login-box ${showForgotPassword ? "blur-background" : ""}`}
        >
          <div className="left-section">
            <h1 className="login-title">Login to your account</h1>
            <form className="form-class" onSubmit={handleLogin}>
              <InputField
                className="input-class"
                type="text"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <InputField
                className="input-class"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <div className="forgot-password">
                <span onClick={() => setShowForgotPassword(true)}>
                  Forgot Password?
                </span>
              </div>
              {error && <div className="error-message">{error}</div>}
              <button className="login-btn" type="submit">
                Sign in
              </button>
              <div className="or-divider">
                <img src={or} alt="or" />
              </div>
              <GoogleLogin
                onSuccess={handleGoogleLoginSuccess}
                onError={() => alert("Google Login Failed")}
              />
              <div className="signup-redirect">
                Don’t have an account?{" "}
                <span onClick={handleRegister}>Sign up</span>
              </div>
            </form>
          </div>
          <div className="right-section">
            <img src={log_side} alt="Login Illustration" />
            <div className="imgtext-text-container">
              <div className="right-section-imgtext1">Welcome Back</div>
              <div className="right-section-imgtext">
                Connect With The Businesses Near You Across India!
              </div>
            </div>
          </div>
        </div>
        {showForgotPassword && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>Forgot Password</h2>
              <p>Enter your email to reset your password:</p>
              {message && <div className="message">{message}</div>}
              <form onSubmit={handleForgotPasswordSubmit}>
                <input
                  type="email"
                  placeholder="Email Address"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className="input-field"
                  required
                />
                <div className="btnss">
                  <button
                    type="submit"
                    className="submit-btn"
                    disabled={isLoading}
                  >
                    {isLoading ? "Sending..." : "Send Reset Link"}
                  </button>
                  <button
                    type="button"
                    onClick={handleCloseForgotPassword}
                    className="cancel-btn"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </GoogleOAuthProvider>
  );
};

export default Login;

// import './Login.css';
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import or from '../../image/or.png';
// import google from '../../image/google.png';
// import { Link, useNavigate } from 'react-router-dom';
// import InputField from "../../Reusable/InputField";
// import log_side from '../../image/pinkbg.jpg';

// const Login = () => {
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [error, setError] = useState('');
//     const [showForgotPassword, setShowForgotPassword] = useState(false);
//     const [forgotEmail, setForgotEmail] = useState('');
//     const [message, setMessage] = useState('');
//     const [isLoading, setIsLoading] = useState(false);
//     const navigate = useNavigate();

//     const [isLoginForm, setIsLoginForm] = useState(true);

// const toggleForm = () => setIsLoginForm((prevState) => !prevState);

//     const handleLogin = async (e) => {
//         e.preventDefault();
//         setError('');

//         if (!email || !password) {
//             setError('Please enter email and password');
//             return;
//         }

//         try {
//             let response = await axios.post('http://localhost:5196/api/UserAuth/login', {
//                 email,
//                 password
//             }, {
//                 headers: {
//                     'Content-Type': 'application/json'
//                 }
//             });

//             if (response.data.token) {
//                 localStorage.setItem('token', response.data.token);
//                 const userRole = response.data.role;
//                 localStorage.setItem('userId', response.data.id);

//                 if (userRole === 'Admin') {
//                     navigate('/AdminMain');
//                 } else {
//                     navigate('/');
//                 }

//                 alert('Login successful!');
//             }
//         } catch (error) {
//             try {
//                 let response = await axios.post('http://localhost:5196/api/UserAuth/business/login', {
//                     email,
//                     password
//                 }, {
//                     headers: {
//                         'Content-Type': 'application/json'
//                     }
//                 });

//                 if (response.data.token) {
//                     localStorage.setItem('token', response.data.token);
//                     const userRole = response.data.role;

//                     if (userRole === 'Business') {
//                         localStorage.setItem('businessId', response.data.id);
//                         navigate('/BusinessDashboard');
//                     }

//                     alert('Login successful!');
//                 } else {
//                     setError('Invalid email or password');
//                 }
//             } catch (error) {
//                 if (error.response && error.response.data.message) {
//                     setError(error.response.data.message);
//                 } else {
//                     setError('Failed to login. Please check your credentials.');
//                 }
//             }
//         }
//     };

//     const handleRegister = () => {
//         navigate('/UserRegistration');
//     };

//     const handleForgotPasswordSubmit = async (e) => {
//         e.preventDefault();
//         if (!forgotEmail) {
//             setMessage('Please enter your email address');
//             return;
//         }

//         setIsLoading(true);

//         try {
//             const response = await axios.post('http://localhost:5196/api/User/forgot-password', {
//                 email: forgotEmail,
//             });

//             setMessage(response.data.message || 'A reset link has been sent to your email.');
//         } catch (error) {
//             if (error.response) {
//                 setMessage(error.response.data.message || 'Something went wrong. Please try again.');
//             } else {
//                 setMessage('Failed to send reset link. Please try again later.');
//             }
//         } finally {
//             setIsLoading(false);
//         }

//         // Reset the dialog after submission
//         setForgotEmail('');  // Clear the email input field
//     };

//     const handleCloseForgotPassword = () => {
//         setShowForgotPassword(false);
//         setForgotEmail('');
//         setMessage('');
//         setIsLoading(false);
//     };

//     useEffect(() => {
//         localStorage.clear();
//     }, []);

//     return (
//         <div className='app-container'>
//             <div className={`login-box ${showForgotPassword ? 'blur-background' : ''}`}>
//                 <div className='left-section'>
//                     <h1 className='login-title'>Welcome Back</h1>
//                     <form className='form-class' onSubmit={handleLogin}>
//                         <InputField
//                             className='input-class'
//                             type="text"
//                             placeholder="Email Address"
//                             value={email}
//                             onChange={(e) => setEmail(e.target.value)}
//                             required
//                         />
//                         <InputField
//                             className='input-class'
//                             type="password"
//                             placeholder="Password"
//                             value={password}
//                             onChange={(e) => setPassword(e.target.value)}
//                             required
//                         />
//                         <div className="forgot-password">
//                             <span onClick={() => setShowForgotPassword(true)}>Forgot Password?</span>
//                         </div>
//                         {error && <div className='error-message'>{error}</div>}
//                         <button className="login-btn" type="submit">Sign in</button>
//                         <div className="or-divider">
//                             <img src={or} alt="or" />
//                         </div>
//                         <button className="google-btn">
//                             <img src={google} alt="Google" /> Continue with Google
//                         </button>
//                         <div className="signup-redirect">
//                             Don’t have an account?{' '}
//                             <span onClick={handleRegister}>Sign up</span>
//                         </div>
//                     </form>
//                 </div>

//                 <div className='right-section'>
//                     <img src={log_side} alt="Login Illustration" />
//                 </div>
//             </div>

//             {/* Forgot Password Modal */}
//             {showForgotPassword && (
//                 <div className="modal-overlay">
//                     <div className="modal-content">
//                         <h2>Forgot Password</h2>
//                         <p>Enter your email to reset your password:</p>
//                         {message && <div className="message">{message}</div>}
//                         <form onSubmit={handleForgotPasswordSubmit}>
//                             <input
//                                 type="email"
//                                 placeholder="Email Address"
//                                 value={forgotEmail}
//                                 onChange={(e) => setForgotEmail(e.target.value)}
//                                 className="input-field"
//                                 required
//                             />
//                             <div className='btnss'>
//                             <button type="submit" className="submit-btn" disabled={isLoading}>
//                                 {isLoading ? 'Sending...' : 'Send Reset Link'}
//                             </button>
//                             <button type="button" onClick={handleCloseForgotPassword} className="cancel-btn">
//                                 Cancel
//                             </button>
//                             </div>
//                         </form>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default Login;

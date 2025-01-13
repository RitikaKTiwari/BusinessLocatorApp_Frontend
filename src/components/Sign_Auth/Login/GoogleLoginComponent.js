import React from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import axios from "axios";

const GoogleLoginComponent = () => {
  const handleLoginSuccess = async (credentialResponse) => {
    const tokenId = credentialResponse.credential;
    console.log("Token ID:", tokenId);

    try {
      // Send the token to your backend for verification
      const response = await axios.post("http://localhost:5196/api/Auth/google-login", {
        tokenId,
      });

      console.log("Backend Response:", response.data);

      if (response.data.success) {
        alert("Login successful!");
        // You can store the user's session/token here if needed
      } else {
        alert("Login failed!");
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("An error occurred during login. Please try again.");
    }
  };

  const handleLoginError = () => {
    console.log("Google Login Failed");
    alert("Login failed. Please try again.");
  };

  return (
    <GoogleOAuthProvider clientId="681829799975-f4sud3i9ie37vib3h5jbm4sr9tfvitfu.apps.googleusercontent.com">
      <div>
        <h1>Login with Google</h1>
        <GoogleLogin
          onSuccess={handleLoginSuccess}
          onError={handleLoginError}
        />
      </div>
    </GoogleOAuthProvider>
  );
};

export default GoogleLoginComponent;


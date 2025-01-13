 
import React, { useState, useEffect } from 'react';
import './ViewProfile.css';
import edit from '../../../image/pencil.png';
import people from '../../../image/user.png';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../../Header/Header';
import Footer from "../../Footer/Footer";
import { IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";


const ViewProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [profilePic, setProfilePic] = useState(people);  // Default profile picture

  const userId = localStorage.getItem("userId");

  const update_user = () => {
    navigate('/UpdateProfile');
  }

  const log_back = () => {
    navigate('/');
  }

  const handleProfilePicUpdate = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('profilePic', file);
    console.log(file);
    console.log("FormData content:", [...formData]); // Verify FormData

    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `http://localhost:5196/api/User/${userId}/UpdateProfilePic`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          },
        }
      );

      if (response.status === 200) {
        // Update the profile pic state after successful upload
        setProfilePic(URL.createObjectURL(file));  // Use local URL for immediate preview
        //alert("Profile picture updated successfully!");
        fetchUserDetails();
      }
    } catch (err) {
      console.error("Error updating profile picture:", err.response ? err.response.data : err.message);
      setError('Failed to update profile picture.');
    }
  };

  const fetchUserDetails = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get('http://localhost:5196/api/UserDetails/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const userData = response.data;
  
      // Convert the byte array to a base64 string for display
      if (userData.profilePic) {
        const base64Image = `data:image/jpeg;base64,${userData.profilePic}`;
        setProfilePic(base64Image);
      } else {
        setProfilePic(people); // Default profile picture
      }
  
      setUser(userData);
    } catch (err) {
      console.error("Error fetching user details:", err.response ? err.response.data : err.message);
      setError('Failed to fetch user details.');
    }
  };
  
  useEffect(() => {
    fetchUserDetails();
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <>
    <div><Header></Header></div>
    <div className="view-profile">
    <div  style={{marginRight: 1000}}>
            <IconButton
              onClick={() => {
                navigate(-1);
                
              }}
              aria-label="back"
            >
              <ArrowBackIcon />
            </IconButton>
          </div>
      <h2>Your Profile</h2>

      <div className="profile-picture-container">
        <img
          src={user.profilePic ? `data:image/jpeg;base64,${user.profilePic}` : people}  // Display the profile picture (updated or default)
          alt="Profile"
          className="profile-picture"
        />
        <button className="edit-icon" onClick={() => document.getElementById('fileInput').click()}>
          <img src={edit} alt="Edit" />
        </button>
        <input
          type="file"
          id="fileInput"
          accept="image/png, image/jpeg, image/jpg"
          style={{ display: 'none' }}
          onChange={handleProfilePicUpdate}
        />
      </div>
      <div className="profile-info">
        <p><strong>First Name</strong> {user.firstName}</p>
        <p><strong>Last Name</strong> {user.lastName}</p>
        <p><strong>Email</strong> {user.email}</p>
        <p><strong>Contact Number</strong> {user.contactNo}</p>
      </div>
      <div className="button-group">
        <button className="update-profile-btn" onClick={update_user}>
          Update Profile
        </button>
      </div>
    </div>
    </>
  );
};

export default ViewProfile;
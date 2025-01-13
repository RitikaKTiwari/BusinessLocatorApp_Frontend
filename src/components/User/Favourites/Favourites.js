import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Favourites.css'; 
import { useNavigate } from 'react-router-dom';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { IconButton } from "@mui/material";

const Favourites = () => {
  const [favorites, setFavorites] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const userId = localStorage.getItem('userId'); 
  const navigate = useNavigate();

  // Fetch favorites on component mount
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await axios.get(`http://localhost:5196/api/Favourites/${userId}`);
        setFavorites(response.data); 
      } catch (error) {
        console.error('Error fetching favorites:', error);
      }
    };

    fetchFavorites();
  }, [userId]);

  const handleBookAppointment = (businessServiceId) => {
    navigate(`/book-appointment/${businessServiceId}`);
  };

  const handleRemoveFavorite = async () => {
    try {
      if (selectedService) {
        await axios.delete(`http://localhost:5196/api/Favourites`, {
          params: {
            userId,
            businessServiceId: selectedService.businessServiceId,
          },
        });

        // Update the favorites list after successful deletion
        setFavorites((prevFavorites) =>
          prevFavorites.filter((fav) => fav.businessServiceId !== selectedService.businessServiceId)
        );
        setShowDialog(false); // Close dialog after deletion
        setSelectedService(null);
      }
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  const openDialog = (favorite) => {
    setSelectedService(favorite);
    setShowDialog(true);
  };

  const closeDialog = () => {
    setShowDialog(false);
    setSelectedService(null);
  };

  return (
    <div>
      <header>
        <Header/>
      </header>
      <div className="favourites-container">
      <h2>Your Favorites</h2>
      <div style={{marginRight:300,marginBottom:30}}>
            <IconButton
              onClick={() => {
                navigate(-1);

              }}
              aria-label="back"
            >
              <ArrowBackIcon />
            </IconButton>
          </div>
      {favorites.length > 0 ? (
        <div className="favorites-grid">
          {favorites.map((favorite) => (
            <div key={favorite.id} className="favorite-card">
              <button
                className="remove-favorite-btn"
                onClick={() => openDialog(favorite)}
              >
                ✖
              </button>
              <h3 className="service-name">{favorite.businessServiceName}</h3>
              <p className="service-description">{favorite.businessServiceDescription}</p>
              
            </div>
          ))}
        </div>
      ) : (
        <p>No favorites found. Start adding some!</p>
      )}

      {showDialog && (
        <div className="dialog-overlay">
          <div className="dialog">
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to remove this favorite?</p>
            <p className="selected-service-name">{selectedService.businessServiceName}</p>
            <div className="dialog-buttons">
              <button className="confirm-btn" onClick={handleRemoveFavorite}>
                Yes, Remove
              </button>
              <button className="cancel-btn" onClick={closeDialog}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    <footer>
      <Footer/>
    </footer>
    </div>
  );
};

export default Favourites;
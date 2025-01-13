// BathroomCard.jsx
import React from 'react';
import './BathroomCard.css';
import br from '../../image/bathroom1.jpg'
const BathroomCard = () => {
  return (
    <div className="br-card-container">
      <div className="br-text-section">
        <h3 className="br-title">Bathroom Cleaning</h3>
        <h1 className="br-subtitle">Get squeaky clean bathrooms</h1>
        <button className="br-explore-button">Explore now</button>
      </div>
      <div className="br-image-section">
        <img
          src={br} // Replace this with your image path
          alt="Bathroom cleaning in progress"
          className="br-card-image"
        />
      </div>
    </div>
  );
};
  
  export default BathroomCard;

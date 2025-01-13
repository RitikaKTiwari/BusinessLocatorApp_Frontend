import React from 'react';
import '../Cards/Card2.css';
import glowyLipImage from '../../image/wall.jpg'; 
import { useNavigate } from 'react-router-dom';


const Card2 = () => {
  const navigate=useNavigate();
  return (
    <div className="glowy-lip-container">
      <div className="texthd-container">
        <div className="titlehd">Elevate your home this festive season.</div>
        <p className="descriptionhd">Book our wall painting service</p>
        <button className="shophd-button" onClick={()=>navigate('ViewFromMenu/13')}>Book Now</button>
      </div>
      <div className="imagehd-container">
        <img src={glowyLipImage} alt="Glowy Lip Look" className="glowy-lip-image" />
      </div>
    </div>
  );
};
export default Card2;
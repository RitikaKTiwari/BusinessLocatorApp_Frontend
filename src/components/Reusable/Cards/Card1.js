import outdoor from "../../image/outdoor.mp4";
import React from "react";
import "./Card1.css";
import { useNavigate } from "react-router-dom";

const Card1 = () => {
  const navigate = useNavigate();
  const clickfurniture = () => {
    navigate("/CategoryViseFurniture");
  };
  return (
    <div className="card1-vid">
      <video className="card1-background-video" autoPlay loop muted>
        <source src={outdoor} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="card1-content-div">
        <div>
          <div>Get squeaky clean bathrooms</div>
        </div>
        <button onClick={clickfurniture} className="card1-content">
          Explore Now
        </button>
      </div>
    </div>
  );
};

export default Card1;

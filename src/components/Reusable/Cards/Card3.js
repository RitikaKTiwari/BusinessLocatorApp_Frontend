// import React from 'react';
// import '../Cards/Card3.css';
// import shoes from '../Video/shoesfinal.mp4'; 

// const Card3 = () => {
//   return (
//     <div className="shoecontainer">
//       <div className="shoehd-container">
//         <div className="shoetitle">GLOWY LIP LOOK</div>
//         <p className="shoedescriptionhd">recreate kylie's makeup look featuring new supple kiss lip glaze.</p>
//         <button className="shoe-button">Shop Now</button>
//       </div>
//       <div className="videoshoecontainer">
//       <video className="videohd" autoPlay loop muted>
//         <source src={shoes} type="video/mp4" />
//         Your browser does not support the video tag.
//       </video>      
//       </div>
//     </div>
//   );
// };
// export default Card3;


import React from 'react';
import './Card3.css';
import shoes from '../Video/shoesfinal.mp4';

const Card3 = () => {
  return (
    <div className="shoecontainer">
      <div className="shoehd-container">
        <div className="shoetitle">For Feet That Love to Chuckle</div>
        <p className="shoedescriptionhd">Here's to chasing your dreams in the cutest pair of shoes.</p>
        <button className="shoe-button">Shop Now</button>
      </div>
      <div className="videoshoecontainer">
        <video className="videohd" autoPlay loop muted>
          <source src={shoes} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  );
};

export default Card3;

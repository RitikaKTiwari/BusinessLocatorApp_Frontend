import React, { useState, useRef } from "react";
import "./Header.css";
import sign from "../../image/sign.png";
import fav from "../../image/fav.png";
import { useNavigate } from "react-router-dom";
import Logout from "../ProfileManagement/Logout";

const Header = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  const handleNavigation = (path) => {
    navigate(path);
    setMenuOpen(false);
  };

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev); // Open or close the menu on click
  };

  const closeMenu = () => {
    setMenuOpen(false); // Close menu on mouse leave
  };

  const openLogoutDialog = () => {
    setLogoutDialogOpen(true);
    setMenuOpen(false);
  };

  const closeLogoutDialog = () => {
    setLogoutDialogOpen(false);
  };

  const businessId = localStorage.getItem("businessId") || null;
  const userId = localStorage.getItem("userId") || null;

  return (
    <div className="header-container">
      <div className="header-branding">
        <div>
          <div className="header-title">Business Locator App</div>
          <div className="header-subtitle">Find. Navigate. Connect.</div>
        </div>
      </div>

      <div className="header-nav">
        <span onClick={() => navigate("/AboutUs")} className="header-nav-link">
          About Us
        </span>

        <select className="header-nav-link-sel">
          <option>IND</option>
        </select>

        {userId || businessId ? (
          <div className="header-dropdown" onMouseLeave={closeMenu}>
            <div className="header-auth-button" onClick={toggleMenu}>
              <img src={sign} alt="Profile" />
              <span>Profile</span>
            </div>
            {menuOpen && (
              <div className="header-dropdown-menu">
                {businessId ? (
                  <>
                    <div
                      className="header-menu-item"
                      onClick={() => handleNavigation("/ViewBusinessProfile")}
                    >
                      View Business Profile
                    </div>
                    <div
                      className="header-menu-item"
                      onClick={() => handleNavigation("/Settings")}
                    >
                      Settings
                    </div>
                    <div className="header-menu-item" onClick={openLogoutDialog}>
                      Logout
                    </div>
                  </>
                ) : (
                  <>
                    <div
                      className="header-menu-item"
                      onClick={() => handleNavigation("/ViewProfile")}
                    >
                      View User Profile
                    </div>
                    <div
                      className="header-menu-item"
                      onClick={() => handleNavigation("/UserSettings")}
                    >
                      Settings
                    </div>
                    <div className="header-menu-item" onClick={openLogoutDialog}>
                      Logout
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        ) : (
          <div
            className="header-auth-button"
            onClick={() => handleNavigation("/Login")}
          >
            <img src={sign} alt="Sign In" />
            <span>Sign In</span>
          </div>
        )}
             {userId?(
        <div className="header-favourites" onClick={() => navigate("/Favourites")}>
          <img src={fav} alt="header-Favourites" />
          <span>Favourites</span>
        </div>
             ):null}
      </div>

      <div className="business-intro">
        <button
          onClick={() => handleNavigation("/BusinessRegistration")}
          className="business-button"
        >
          Introduce your business
        </button>
      </div>

      {logoutDialogOpen && <Logout onClose={closeLogoutDialog} />}
    </div>
  );
};

export default Header;


// import React, { useState } from "react";
// import "./Header2.css";
// import sign from "../../image/sign.png";
// import fav from "../../image/fav.png";
// import { useNavigate } from "react-router-dom";
// import Logout from "../ProfileManagement/Logout";

// const Header = () => {
//   const navigate = useNavigate();
//   const [menuOpen, setMenuOpen] = useState(false);
//   const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

//   const handleNavigation = (path) => {
//     navigate(path);
//     setMenuOpen(false);
//   };

//   const toggleMenu = () => {
//     setMenuOpen(!menuOpen);
//   };

//   const openLogoutDialog = () => {
//     setLogoutDialogOpen(true);
//     setMenuOpen(false);
//   };

//   const closeLogoutDialog = () => {
//     setLogoutDialogOpen(false);
//   };

//   const businessId = localStorage.getItem("businessId") || null;
//   const userId = localStorage.getItem("userId") || null;

//   return (
//     <div className="header-container">
//       <div className="header-branding">
//         <div>
//           <div className="header-title">Business Locator App</div>
//           <div className="header-subtitle">Find. Navigate. Connect.</div>
//         </div>
//       </div>

//       <div className="header-nav">
//         <span onClick={() => navigate("/ViewCategory")} className="header-nav-link">
//           About Us
//         </span>

//         <select className="header-nav-link-sel">
//           <option>IND</option>
//         </select>

//         {userId || businessId ? (
//           <div className="header-dropdown">
//             <div className="header-auth-button" onClick={toggleMenu}>
//               <img src={sign} alt="Profile" />
//               <span>Profile</span>
//             </div>
//             {menuOpen && (
//               <div className="header-dropdown-menu">
//                 {businessId ? (
//                   <>
//                     <div
//                       className="header-menu-item"
//                       onClick={() => handleNavigation("/ViewBusinessProfile")}
//                     >
//                       View Business Profile
//                     </div>
//                     <div
//                       className="header-menu-item"
//                       onClick={() => handleNavigation("/Settings")}
//                     >
//                       Settings
//                     </div>
//                     <div className="header-menu-item" onClick={openLogoutDialog}>
//                       Logout
//                     </div>
//                   </>
//                 ) : (
//                   <>
//                     <div
//                       className="header-menu-item"
//                       onClick={() => handleNavigation("/ViewProfile…
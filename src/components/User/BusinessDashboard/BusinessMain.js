import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import "./BusinessMain.css";
import BusinessDashboard from "./BusinessDashboard";
import ViewCategory from "../../User/Category/ViewCategory"; // Add other components as needed
import ViewSubCategory from "../SubCategory/ViewSubCategory";
import ViewService from "../Service/ViewService";
import ViewTechnician from "../Technician/ViewTechnician";
import ViewMyServices from "../ProfileManagement/BusinessProfileManagement/ViewMyServices";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const BusinessMain = () => {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [activeComponent, setActiveComponent] = useState("Dashboard"); // Manage visible component
  const menuRef = useRef(null);

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };

  // Close the menu when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle menu item click
  const handleMenuClick = (component) => {
    setActiveComponent(component);
    setMenuOpen(false); // Close menu after selection
  };

  return (
    <>
    <div className={`business-main ${isMenuOpen ? "shifted" : ""}`}>
      <div className="my-head">
        <Header />
      </div>
      <div className="busi-dashboard-header">
        <FontAwesomeIcon
          icon={isMenuOpen ? faTimes : faBars}
          className="busi-menu-icon"
          onClick={toggleMenu}
        />
      </div>

      {/* Sliding Menu */}
      <div
        className={`bus-menu ${isMenuOpen ? "bus-menu-open" : ""}`}
        ref={menuRef}
      >
        <ul className="bus-ul">
          <li
            onClick={() => handleMenuClick("Dashboard")}
            className="bus-menu-menu-link"
          >
            Dashboard
          </li>
          <li
            onClick={() => handleMenuClick("ViewCategory")}
            className="bus-menu-menu-link"
          >
            Request Category
          </li>
          <li
            onClick={() => handleMenuClick("ViewSubCategory")}
            className="bus-menu-menu-link"
          >
            Request SubCategory
          </li>
          <li
            onClick={() => handleMenuClick("ViewServices")}
            className="bus-menu-menu-link"
          >
            Request Services
          </li>

          <li
            onClick={() => handleMenuClick("ViewTechnician")}
            className="bus-menu-menu-link"
          >
            Manage Technicians
          </li>

          <li
            onClick={() => handleMenuClick("ViewMyServices")}
            className="bus-menu-menu-link"
          >
            Manage Your Services
          </li>
        </ul>
      </div>

      {/* Dynamic Component Rendering */}
      <div className="bus-content">
        {activeComponent === "Dashboard" && <BusinessDashboard />}
        {activeComponent === "ViewCategory" && <ViewCategory />}
        {activeComponent === "ViewSubCategory" && <ViewSubCategory />}
        {activeComponent === "ViewServices" && <ViewService />}
        {activeComponent === "ViewTechnician" && <ViewTechnician />}
        {activeComponent === "ViewMyServices" && <ViewMyServices />}
      </div>

      <Footer />
    </div>
    </>
  );
};

export default BusinessMain;

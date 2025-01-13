import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import BuildIcon from "@mui/icons-material/Build";
import CategoryIcon from "@mui/icons-material/Category";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ArrowUpwardIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDropDown";
import LogoutIcon from "@mui/icons-material/Logout";
import Dashboard from "./Dashboard";
import UserManagement from "./UserManagement/UserManagement";
import AddAdminUser from "./UserManagement/AddAdminUser";
import CategoryManagement from "./CategoryManagement/CategoryManagement";
import SubcategoryManagement from "./SubCategoryManagement/SubCategoryManagement";
import ServiceManagement from "./ServiceManagement/ServiceManagement";
import BusinessManagement from "./BusinessManagement/BusinessManagement";
import AddAdminBusiness from "./BusinessManagement/AddAdminBusiness";
import BusinessApproval from "./NotificationManagement/BusinessApproval";
import CategoryApproval from "./NotificationManagement/CategoryApproval";
import SubCategoryApproval from "./NotificationManagement/SubCategoryApproval";
import ServiceApproval from "./NotificationManagement/ServiceApproval";
import PendingNotification from "./NotificationManagement/PendingNotification";
import MenuIcon from "@mui/icons-material/Menu";
import Logout from "../User/ProfileManagement/Logout";
import "./AdminMain.css";

const AdminMain = () => {
  const [activeSection, setActiveSection] = useState("Dashboard");
  const [showApproval, setShowApproval] = useState(false);
  const [greeting, setGreeting] = useState("");
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const navigate = useNavigate();

  const handleNavigation = (page) => {
    setActiveSection(page);
    if (
      page !== "UserManagement" &&
      page !== "Dashboard" &&
      page !== "CategoryManagement" &&
      page !== "SubCategoryManagement" &&
      page !== "ServiceManagement" &&
      page !== "BusinessManagement" &&
      page !== "AddAdminBusiness" &&
      page !== "AddAdminUser" &&
      page !== "BusinessApproval" &&
      page !== "CategoryApproval" &&
      page !== "SubCategoryApproval" &&
      page !== "ServiceApproval" &&
      page !== "PendingNotification"
    ) {
      navigate(`/${page}`);
    }
  };

  const openLogoutDialog = () => {
    setLogoutDialogOpen(true); // Open the logout dialog
  };

  const closeLogoutDialog = () => {
    setLogoutDialogOpen(false); // Close the logout dialog
  };

  useEffect(() => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) {
      setGreeting("Good Morning");
    } else if (currentHour < 18) {
      setGreeting("Good Afternoon");
    } else {
      setGreeting("Good Evening");
    }
  }, []);

  return (
    <div className="admin-main1">
      <header
        className={`adminmain-header ${
          isSidebarExpanded ? "expanded" : "collapsed"
        }`}
      >
        <div style={{ display: "flex" }}>
          <p
            style={{ marginRight: "10px" }}
            onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
          >
            <MenuIcon />
          </p>
          <p className="adminmain-subtitle">{greeting}, Admin!</p>
        </div>
        <div className="adminmain-quick-actions">
          <span
            className="adminmain-quick-action-icon"
            onClick={() => {
              handleNavigation("PendingNotification");
            }}
          >
            <NotificationsIcon />
          </span>
          <button
            className="adminmain-quick-action-btn"
            onClick={() => {
              handleNavigation("AddAdminUser");
            }}
          >
            Add New User
          </button>
          <button
            className="adminmain-quick-action-btn"
            onClick={() => {
              handleNavigation("AddAdminBusiness");
            }}
          >
            Add New Businesses
          </button>
        </div>
      </header>
      <div
        className={`adminmain-sidebar ${
          isSidebarExpanded ? "expanded" : "collapsed"
        }`}
      >
        <h2 className="adminmain-sidebar-title">
          {isSidebarExpanded && "Admin Panel"}
        </h2>
        <ul className="adminmain-sidebar-links">
          <li>
            <a
              onClick={() => handleNavigation("Dashboard")}
              className={`adminmain-sidebar-link ${
                activeSection === "Dashboard" ? "active" : ""
              }`}
              href="#"
            >
              <DashboardIcon />
              {isSidebarExpanded && "Dashboard"}
            </a>
          </li>

          <li>
            <a
              onClick={() => handleNavigation("UserManagement")}
              className={`adminmain-sidebar-link ${
                activeSection === "UserManagement" ? "active" : ""
              }`}
              href="#"
            >
              <PeopleIcon /> {isSidebarExpanded && "Users"}
            </a>
          </li>

          <li>
            <a
              onClick={() => handleNavigation("CategoryManagement")}
              className={`adminmain-sidebar-link ${
                activeSection === "CategoryManagement" ? "active" : ""
              }`}
              href="#"
            >
              <CategoryIcon /> {isSidebarExpanded && "Category"}
            </a>
          </li>

          <li>
            <a
              onClick={() => handleNavigation("SubCategoryManagement")}
              className={`adminmain-sidebar-link ${
                activeSection === "SubCategoryManagement" ? "active" : ""
              }`}
              href="#"
            >
              <LocalOfferIcon /> {isSidebarExpanded && "Sub-Category"}
            </a>
          </li>

          <li>
            <a
              onClick={() => handleNavigation("BusinessManagement")}
              className={`adminmain-sidebar-link ${
                activeSection === "BusinessManagement" ? "active" : ""
              }`}
              href="#"
            >
              <BusinessCenterIcon />
              {isSidebarExpanded && "Business"}
            </a>
          </li>

          <li>
            <a
              onClick={() => handleNavigation("ServiceManagement")}
              className={`adminmain-sidebar-link ${
                activeSection === "ServiceManagement" ? "active" : ""
              }`}
              href="#"
            >
              <BuildIcon /> {isSidebarExpanded && "Services"}
            </a>
          </li>

          <li>
            <a
              className="adminmain-sidebar-link"
              href="#"
              onClick={() => setShowApproval(!showApproval)}
            >
              <NotificationsIcon /> {isSidebarExpanded && "Approvals"}
              <span style={{ marginLeft: "50px" }}>
                {isSidebarExpanded && showApproval ? (
                  <ArrowUpwardIcon />
                ) : isSidebarExpanded && !showApproval ? (
                  <ArrowDownwardIcon />
                ) : null}
              </span>
            </a>
            {showApproval && (
              <div className="adminmain-approval-dropdown">
                <div>
                  <a
                    onClick={() => handleNavigation("BusinessApproval")}
                    className={`adminmain-sidebar-link {activeSection === 'BusinessApproval' ? 'active' : ''}`}
                    href="#"
                    style={{ textAlign: "right", display: "block" }}
                  >
                    Business Approval
                  </a>
                </div>
                <div>
                  <a
                    onClick={() => handleNavigation("CategoryApproval")}
                    className={`adminmain-sidebar-link ${
                      activeSection === "CategoryApproval" ? "active" : ""
                    }`}
                    href="#"
                    style={{ textAlign: "right", display: "block" }}
                  >
                    Category Approval
                  </a>
                </div>
                <div>
                  <a
                    onClick={() => handleNavigation("SubCategoryApproval")}
                    className={`adminmain-sidebar-link ${
                      activeSection === "SubCategoryApproval" ? "active" : ""
                    }`}
                    href="#"
                    style={{ textAlign: "right", display: "block" }}
                  >
                    SubCategory Approval
                  </a>
                </div>
                <div>
                  <a
                    onClick={() => handleNavigation("ServiceApproval")}
                    className={`adminmain-sidebar-link ${
                      activeSection === "ServiceApproval" ? "active" : ""
                    }`}
                    href="#"
                    style={{ textAlign: "right", display: "block" }}
                  >
                    Service Approval
                  </a>
                </div>
              </div>
            )}
          </li>

          <li>
            <a
              onClick={openLogoutDialog}
              className="adminmain-sidebar-link"
              href="#"
            >
              <LogoutIcon /> {isSidebarExpanded && "Logout"}
            </a>
          </li>
        </ul>
      </div>
      <div className="adminmain-content">
        <h1>
          {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}
        </h1>
        <p>
          {activeSection === "Dashboard" && <Dashboard />}
          {activeSection === "UserManagement" && <UserManagement />}
          {activeSection === "CategoryManagement" && <CategoryManagement />}
          {activeSection === "SubCategoryManagement" && (
            <SubcategoryManagement />
          )}
          {activeSection === "ServiceManagement" && <ServiceManagement />}
          {activeSection === "BusinessManagement" && <BusinessManagement />}

          {activeSection === "BusinessApproval" && <BusinessApproval />}
          {activeSection === "CategoryApproval" && <CategoryApproval />}
          {activeSection === "SubCategoryApproval" && <SubCategoryApproval />}
          {activeSection === "ServiceApproval" && <ServiceApproval />}
          {activeSection === "PendingNotification" && <PendingNotification />}
          {activeSection === "AddAdminBusiness" && (
            <AddAdminBusiness setActiveSection={setActiveSection} />
          )}
          {activeSection === "AddAdminUser" && (
            <AddAdminUser setActiveSection={setActiveSection} />
          )}
        </p>
      </div>
      {logoutDialogOpen && <Logout onClose={closeLogoutDialog} />}
    </div>
  );
};

export default AdminMain;

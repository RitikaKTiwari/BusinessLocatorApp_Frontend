// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import './ViewBusinessProfile.css';

// const ViewBusinessProfile = () => {
//     const [business, setBusiness] = useState(null);
//     const [error, setError] = useState(null);
//     const businessId = 1; // Replace with dynamic ID if needed

//     useEffect(() => {
//         const fetchBusinessProfile = async () => {
//             try {
//                 const response = await axios.get(`http://localhost:5196/api/Business/${businessId}`);
//                 setBusiness(response.data);
//             } catch (error) {
//                 setError("Failed to fetch business profile.");
//             }
//         };

//         fetchBusinessProfile();
//     }, [businessId]);

//     if (error) return <div className="error-message">{error}</div>;

//     return (
//         <div className="business-profile">
//             {business ? (
//                 <>
//                     <h2>{business.name}</h2>
//                     <p><strong>Email:</strong> {business.email}</p>
//                     {/* <p><strong>PasswordHash:</strong> {business.passwordHash}</p> */}
//                     <p><strong>Description:</strong> {business.description}</p>
//                     <p><strong>Contact No:</strong> {business.contactNo}</p>
//                     <div className="address">
//                         <h3>Address</h3>
//                         <p>{business.address.street}, {business.address.location}</p>
//                         <p><strong>Latitude:</strong> {business.address.latitude}</p>
//                         <p><strong>Longitude:</strong> {business.address.longitude}</p>
//                         <p><strong>Primary Address:</strong> {business.address.isPrimary ? "Yes" : "No"}</p>
//                     </div>
//                 </>
//             ) : (
//                 <p>Loading business profile...</p>
//             )}
//         </div>
//         // <div className="business-profile">
//         //         <>
//         //             <h2>business.Name</h2>
//         //             <p><strong>Email:</strong> businessEmail</p>
//         //             <p><strong>Description:</strong> businessDescription</p>
//         //             <p><strong>Contact No:</strong> businessContactNo</p>
//         //             <div className="address">
//         //                 <h3>Address</h3>
//         //                 <p>businessAddressStreet, businessAddressLocation</p>
//         //                 <p><strong>Latitude:</strong> businessAddressLatitude</p>
//         //                 <p><strong>Longitude:</strong> businessAddressLongitude</p>
//         //                 <p><strong>Primary Address:</strong> businessAddressIsPrimary Yes  No</p>
//         //             </div>
//         //         </>

//         // </div>
//     );
// };

// export default ViewBusinessProfile;


// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import "./ViewBusinessProfile.css";

// const ViewBusinessProfile = () => {
//     const [business, setBusiness] = useState(null);
//     const [error, setError] = useState(null);
//     const [activeTab, setActiveTab] = useState("Overview");

//     const businessId = 1; // Replace with dynamic ID if necessary

//     // Fetch business details
//     useEffect(() => {
//         const fetchBusinessProfile = async () => {
//             try {
//                 const response = await axios.get(`http://localhost:5196/api/Business/${businessId}`);
//                 setBusiness(response.data);
//             } catch (error) {
//                 setError("Failed to fetch business profile.");
//             }
//         };

//         fetchBusinessProfile();
//     }, [businessId]);

//     // Render content based on active tab
//     const renderContent = () => {
//         switch (activeTab) {
//             case "Overview":
//                 return business ? (
//                     <div className="overview-section">
//                         <h2>{business.name}</h2>
//                         <p><strong>Email:</strong> {business.email}</p>
//                         <p><strong>Description:</strong> {business.description}</p>
//                         <p><strong>Contact No:</strong> {business.contactNo}</p>
//                         <div className="address">
//                             <h3>Address</h3>
//                             <p>{business.address.street}, {business.address.location}</p>
//                             <p><strong>Latitude:</strong> {business.address.latitude}</p>
//                             <p><strong>Longitude:</strong> {business.address.longitude}</p>
//                             <p><strong>Primary Address:</strong> {business.address.isPrimary ? "Yes" : "No"}</p>
//                         </div>
//                     </div>
//                 ) : (
//                     <p>Loading...</p>
//                 );

//             case "Notifications":
//                 return <div className="notifications-section">No notifications available.</div>;

//             case "Requests":
//                 return <div className="requests-section">No requests available.</div>;

//             default:
//                 return <div>Invalid Tab</div>;
//         }
//     };

//     if (error) return <div className="error-message">{error}</div>;

//     return (
//         <div className="business-profile-management">
//             {/* Sidebar Section */}
//             <aside className="profile-sidebar">
//                 {business && (
//                     <>
//                         <img src={business.avatar || "https://via.placeholder.com/150"} alt="Business Avatar" className="avatar" />
//                         <h3>{business.name}</h3>
//                         <p>{business.email}</p>
//                         <p>{business.createdAt}</p>
//                         <p>{business.updatedAt}</p>
//                         <button className="update-button">Update Profile</button>
//                     </>
//                 )}
//             </aside>

//             {/* Main Content Section */}
//             <main className="profile-main">
//                 <nav className="profile-tabs">
//                     <button className={activeTab === "Overview" ? "active" : ""} onClick={() => setActiveTab("Overview")}>
//                         Overview
//                     </button>
//                     <button className={activeTab === "Notifications" ? "active" : ""} onClick={() => setActiveTab("Notifications")}>
//                         Notifications
//                     </button>
//                     <button className={activeTab === "Requests" ? "active" : ""} onClick={() => setActiveTab("Requests")}>
//                         Requests
//                     </button>
//                 </nav>
//                 <section className="profile-content">
//                     {renderContent()}
//                 </section>
//             </main>
//         </div>
//     );
// };

// export default ViewBusinessProfile;

// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import "./ViewBusinessProfile.css";

// const ViewBusinessProfile = () => {
//     const [business, setBusiness] = useState(null);
//     const [error, setError] = useState(null);
//     const [activeTab, setActiveTab] = useState("Overview");
//     const [filter, setFilter] = useState("Category"); // Default filter for Requests
//     const [requests, setRequests] = useState([]);

//     const businessId = 1; // Replace with dynamic ID if necessary

//     // Fetch business details
//     useEffect(() => {
//         const fetchBusinessProfile = async () => {
//             try {
//                 const response = await axios.get(`http://localhost:5196/api/Business/${businessId}`);
//                 setBusiness(response.data);
//             } catch (error) {
//                 setError("Failed to fetch business profile.");
//             }
//         };

//         fetchBusinessProfile();
//     }, [businessId]);

//     // Fetch requests based on filter
//     useEffect(() => {
//         if (activeTab === "Requests") {
//             const fetchRequests = async () => {
//                 try {
//                     const url =
//                         filter === "Category"
//                             ? `http://localhost:5196/api/CategoryRequest/Business/${businessId}`
//                             : `http://localhost:5196/api/SubCategoryRequest/Business/${businessId}`;
//                     const response = await axios.get(url);
//                     setRequests(response.data);
//                 } catch (error) {
//                     setRequests([]);
//                     setError("Failed to fetch requests.");
//                 }
//             };

//             fetchRequests();
//         }
//     }, [filter, activeTab, businessId]);

//     // Render content based on active tab
//     const renderContent = () => {
//         switch (activeTab) {
//             case "Overview":
//                 return business ? (
//                     <div className="overview-section">
//                         <h2>{business.name}</h2>
//                         <p><strong>Email:</strong> {business.email}</p>
//                         <p><strong>Description:</strong> {business.description}</p>
//                         <p><strong>Contact No:</strong> {business.contactNo}</p>
//                         <div className="address">
//                             <h3>Address</h3>
//                             <p>{business.address.street}, {business.address.location}</p>
//                             <p><strong>Latitude:</strong> {business.address.latitude}</p>
//                             <p><strong>Longitude:</strong> {business.address.longitude}</p>
//                             <p><strong>Primary Address:</strong> {business.address.isPrimary ? "Yes" : "No"}</p>
//                         </div>
//                     </div>
//                 ) : (
//                     <p>Loading...</p>
//                 );

//             case "Notifications":
//                 return <div className="notifications-section">No notifications available.</div>;

//             case "Requests":
//                 return (
//                     <div className="requests-section">
//                         <div className="filter-section">
//                             <label htmlFor="filter">Filter by:</label>
//                             <select
//                                 id="filter"
//                                 value={filter}
//                                 onChange={(e) => setFilter(e.target.value)}
//                                 className="filter-dropdown"
//                             >
//                                 <option value="Category">Category</option>
//                                 <option value="SubCategory">SubCategory</option>
//                             </select>
//                         </div>
//                         <div className="requests-list">
//                             {requests.length > 0 ? (
//                                 <table className="requests-table">
//                                     <thead>
//                                         <tr>
//                                             {filter === "Category" ? (
//                                                 <>
//                                                     <th>Name</th>
//                                                     <th>Status</th>
//                                                     <th>Updated At</th>
//                                                 </>
//                                             ) : (
//                                                 <>
//                                                     <th>Name</th>
//                                                     <th>Category Name</th>
//                                                     <th>Status</th>
//                                                     <th>Updated At</th>
//                                                 </>
//                                             )}
//                                         </tr>
//                                     </thead>
//                                     <tbody>
//                                         {requests.map((request, index) => (
//                                             <tr key={index}>
//                                                 <td>{request.name}</td>
//                                                 {filter === "SubCategory" && <td>{request.categoryName}</td>}
//                                                 <td>{request.status}</td>
//                                                 <td>{new Date(request.updatedAt).toLocaleString()}</td>
//                                             </tr>
//                                         ))}
//                                     </tbody>
//                                 </table>
//                             ) : (
//                                 <p>No requests available.</p>
//                             )}
//                         </div>
//                     </div>
//                 );

//             default:
//                 return <div>Invalid Tab</div>;
//         }
//     };

//     if (error) return <div className="error-message">{error}</div>;

//     return (
//         <div className="business-profile-management">
//             {/* Sidebar Section */}
//             <aside className="profile-sidebar">
//                 {business && (
//                     <>
//                         <img src={business.avatar || "https://via.placeholder.com/150"} alt="Business Avatar" className="avatar" />
//                         <h3>{business.name}</h3>
//                         <p>{business.email}</p>
//                         <button className="update-button">Update Profile</button>
//                     </>
//                 )}
//             </aside>

//             {/* Main Content Section */}
//             <main className="profile-main">
//                 <nav className="profile-tabs">
//                     <button className={activeTab === "Overview" ? "active" : ""} onClick={() => setActiveTab("Overview")}>
//                         Overview
//                     </button>
//                     <button className={activeTab === "Notifications" ? "active" : ""} onClick={() => setActiveTab("Notifications")}>
//                         Notifications
//                     </button>
//                     <button className={activeTab === "Requests" ? "active" : ""} onClick={() => setActiveTab("Requests")}>
//                         Requests
//                     </button>
//                 </nav>
//                 <section className="profile-content">
//                     {renderContent()}
//                 </section>
//             </main>
//         </div>
//     );
// };

// export default ViewBusinessProfile;
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ViewBusinessProfile.css";
import RequestTab from "./RequestTab";
import NotificationTab from "./NotificationTab";
import OverviewTab from "./OverviewTab";
import edit from "../../../image/pencil.png";

const ViewBusinessProfile = () => {
    const [business, setBusiness] = useState(null);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState("Overview");

    const businessId = localStorage.getItem("businessId");

    const handleProfilePicUpdate = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("profilePic", file);

        try {
            const response = await axios.put(
                `http://localhost:5196/api/Business/${businessId}/UpdateProfilePic`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            if (response.status === 200) {
                console.log("Profile picture updated successfully!");
            }
        } catch (error) {
            console.error("Error updating profile picture:", error);
        }
        fetchBusinessProfile();
    };

    const fetchBusinessProfile = async () => {
        try {
            const response = await axios.get(`http://localhost:5196/api/Business/${businessId}`);
            setBusiness(response.data);
        } catch (error) {
            setError("Failed to fetch business profile.");
        }
    };

    useEffect(() => {
        fetchBusinessProfile();
    }, [businessId]);

    const renderContent = () => {
        switch (activeTab) {
            case "Overview":
                return <OverviewTab businessId={businessId} />;
            case "Notifications":
                return <NotificationTab businessId={businessId} />;
            case "Requests":
                return <RequestTab businessId={businessId} />;
            default:
                return <div>Invalid Tab</div>;
        }
    };

    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="business-profile-management">
            <aside className="profile-sidebar">
                {business && (
                    <>
                        <div className="profile-container">
                            <div className="avatar-container">
                                <img
                                    src={business.profilePic ? `data:image/jpeg;base64,${business.profilePic}` : "https://via.placeholder.com/150"}
                                    alt="Business Profile"
                                    className="avatar"
                                />


                                <button
                                    onClick={() => document.getElementById("fileInput").click()}
                                >
                                    <img src={edit} alt="Edit Profile Picture" className="pencil-icon" />
                                </button>
                                <input
                                    type="file"
                                    id="fileInput"
                                    accept="image/png, image/jpeg, image/jpg"
                                    style={{ display: "none" }}
                                    onChange={handleProfilePicUpdate}
                                />
                            </div>
                            <h3>{business.name}</h3>
                            <p>{business.email}</p>
                            <div className="contact-info">
                                <p><strong>Phone:</strong> {business.contactNo}</p>
                                <p>
                                    <strong>Website:</strong>{" "}
                                    <a href={business.website} target="_blank" rel="noopener noreferrer">
                                        {business.website || "Not available"}
                                    </a>
                                </p>
                            </div>
                            <div className="business-stats">
                                {/* <p><strong>Services Offered:</strong> {business.servicesCount || 0}</p> */}
                                <p>
                                    <strong>Registered:</strong>{" "}
                                    {business.createdAt
                                        ? new Date(business.createdAt).toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        })
                                        : "N/A"}
                                </p>
                            </div>
                            <div className="social-links">
                                <h4>Follow Us</h4>
                                <a href={business.facebook} target="_blank" rel="noopener noreferrer">
                                    Facebook
                                </a>
                                <a href={business.instagram} target="_blank" rel="noopener noreferrer">
                                    Instagram
                                </a>
                                <a href={business.linkedin} target="_blank" rel="noopener noreferrer">
                                    LinkedIn
                                </a>
                            </div>
                            {/* <button className="update-button">Update Profile</button> */}
                        </div>
                    </>
                )}
            </aside>

            <main className="profile-main">
                <nav className="profile-tabs">
                    <button className={activeTab === "Overview" ? "active" : ""} onClick={() => setActiveTab("Overview")}>
                        Overview
                    </button>
                    <button className={activeTab === "Notifications" ? "active" : ""} onClick={() => setActiveTab("Notifications")}>
                        Notifications
                    </button>
                    <button className={activeTab === "Requests" ? "active" : ""} onClick={() => setActiveTab("Requests")}>
                        Requests
                    </button>
                </nav>
                <section className="profile-content">
                    {renderContent()}
                </section>
            </main>
        </div>
    );
};

export default ViewBusinessProfile;

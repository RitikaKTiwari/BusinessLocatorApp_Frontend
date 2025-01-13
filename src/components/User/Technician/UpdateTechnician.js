import React, { useState, useEffect } from "react";
import axios from "axios";
import "./UpdateTechnician.css";

const UpdateTechnician = ({ technicianId, onClose }) => {
    const [technician, setTechnician] = useState({
        fullName: "",
        experience: "",
        businessServiceId: "",
    });
    const [businessServices, setBusinessServices] = useState([]);

    useEffect(() => {
        fetchBusinessService();
        fetchTechnician();
    }, []);

    const fetchBusinessService = async () => {
        try {
            const response = await axios.get(`http://localhost:5196/api/BusinessService/Business/${localStorage.getItem('businessId')}`);
            setBusinessServices(response.data);
        } catch (error) {
            console.error("Error fetching business services:", error);
        }
    };

    const fetchTechnician = async () => {
        try {
            const response = await axios.get(`http://localhost:5196/api/Technician/${technicianId}`);
            setTechnician(response.data);
        } catch (error) {
            console.error("Error fetching technician:", error);
        }
    };

    const handleInputChange = (e) => {
        setTechnician({
            ...technician,
            [e.target.name]: e.target.value,
        });
    };

    const handleUpdate = async () => {
        try {
            await axios.put(`http://localhost:5196/api/Technician/${technicianId}`, technician);
            alert("Technician updated successfully.");
            onClose(); // Close the popup after successful update
        } catch (error) {
            console.error("Error updating technician:", error);
        }
    };

    return (
        <div className="update-technician-container">
            <h2>Update Technician</h2>
            <form onSubmit={(e) => e.preventDefault()}>
                <label>Full Name:</label>
                <input
                    type="text"
                    name="fullName"
                    style={{width:'90%'}}
                    value={technician.fullName}
                    onChange={handleInputChange}
                />
                <label>Experience:</label>
                <textarea
                    name="experience"
                    style={{width:'90%'}}
                    value={technician.experience}
                    onChange={handleInputChange}
                />
                <label>Service:</label>
                <select
                    name="businessServiceId"
                    style={{width:'90%'}}
                    value={technician.businessServiceId}
                    onChange={handleInputChange}
                >
                    <option value="">Select Service</option>
                    {businessServices.map((service) => (
                        <option key={service.id} value={service.id}>
                            {service.service.name}
                        </option>
                    ))}
                </select>
                <div className="button-container">
                <button type="button" className="insert-btn" onClick={handleUpdate}>
                    Update
                </button>
                <button type="button" className="cancel-btn" onClick={onClose}>
                    Cancel
                </button>
                </div>
            </form>
        </div>
    );
};

export default UpdateTechnician;


// import axios from "axios";
// import React, { useState, useEffect } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import "./UpdateTechnician.css";

// const UpdateTechnician = () => {
//     const navigate = useNavigate();
//     const [Technician, setTechnician] = useState({
//         fullName: "",
//         experience: "",
//         businessServiceId: "",
//     });
//     const [businessServices, setBusinessServices] = useState([]);
//     const [message, setMessage] = useState("");
//     const businessId = localStorage.getItem("businessId");
//     const { technicianId } = useParams();

//     useEffect(() => {
//         fetchBusinessService();
//         fetchTechnician();
//     }, []);

//     const fetchBusinessService = async () => {
//         try {
//             const response = await axios.get(`http://localhost:5196/api/BusinessService/Business/${businessId}`);
//             setBusinessServices(response.data);
//         } catch (error) {
//             console.error("Error fetching business services:", error);
//         }
//     };

//     const fetchTechnician = async () => {
//         try {
//             const response = await axios.get(`http://localhost:5196/api/Technician/${technicianId}`);
//             setTechnician(response.data);
//         } catch (error) {
//             console.error("Error fetching technicians:", error);
//         }
//     }

//     // Handle input changes
//     const handleInputChange = (e) => {
//         setTechnician({
//             ...Technician,
//             [e.target.name]: e.target.value
//         });
//     };

//     // Handle request submission
//     const handleUpdate = async () => {
//         const data = {
//             fullName: Technician.fullName,
//             experience: Technician.experience,
//             businessServiceId: Technician.businessServiceId,
//         };

//         try {
//             await axios.put(`http://localhost:5196/api/Technician/${technicianId}`, data);
//             setTechnician({ fullName: "", experience: "", businessServiceId: "" });
//             alert("Technician updated successfully.");
//             navigate(-1);
//         } catch (error) {
//             console.error("Error submitting request:", error);
//             setMessage("Error adding technician. Please try again.");
//         }
//     };

//     return (
//         <div className="update-technician-container">
//             <h1>Update Technician</h1>
//             <form onSubmit={(e) => e.preventDefault()}>
//                 <label>Full Name:</label>
//                 <input
//                     type="text"
//                     name="fullName"
//                     value={Technician.fullName}
//                     onChange={handleInputChange}
//                     placeholder="Enter full name"
//                 />

//                 <label>Experience:</label>
//                 <textarea
//                     name="experience"
//                     value={Technician.experience}
//                     onChange={handleInputChange}
//                     placeholder="Enter experience"
//                 />

//                 <label>Services:</label>
//                 <select
//                     name="businessServiceId"
//                     value={Technician.businessServiceId}
//                     onChange={(e) => {
//                         if (e.target.value === "add") {
//                             navigate("/InsertBusinessService"); // Navigate to Add Category
//                         } else {
//                             handleInputChange(e);
//                         }
//                     }}
//                 >
//                     <option value="">Select Service</option>
//                     {businessServices.map((businessService) =>
//                         businessService.isActive ? (
//                             <option key={businessService.id} value={businessService.id}>
//                                 {businessService.service.name}
//                             </option>
//                         ) : null
//                     )}
//                     <option value="add">+ Add New Business Service</option>
//                 </select>
//                 <div className="button-container" style={{ flexDirection: 'row' }}>
//                     <button onClick={handleUpdate} className="insert-btn">
//                         Update
//                     </button>

//                     <button onClick={() => { navigate(-1) }} className="cancel-btn">
//                         Cancel
//                     </button>
//                 </div>

//                 {message && (
//                     <p className={`message ${message.includes("successfully") ? "success" : "error"}`}>
//                         {message}
//                     </p>
//                 )}
//             </form>
//         </div>
//     );
// };

// export default UpdateTechnician;

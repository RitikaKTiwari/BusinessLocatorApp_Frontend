import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./InsertBusinessService.css";
import ApprovedDialogComponent from '../../User/DialogComponent/ApprovedDialogComponent';


const InsertBusinessService = ({ onClose }) => {
  const businessId = localStorage.getItem("businessId");
  const [services, setServices] = useState([]);
  const [approvedDialogOpen, setApprovedDialogOpen] = useState(false);
  const [message, setMessage] = useState({});
  const navigate = useNavigate();
  const [showInsert, setShowInsert] = useState(true); // State to control dialog visibility
  const [newService, setNewService] = useState({
    businessId: businessId,
    serviceId: "",
    daysOfWeek: {},
    price: null,
    imageUrl: "", // This will hold the base64 string for the image
  });
  const [daysOfWeek, setDaysOfWeek] = useState({
    Monday: { OpenTime: "", CloseTime: "", isWorkingDay: false },
    Tuesday: { OpenTime: "", CloseTime: "", isWorkingDay: false },
    Wednesday: { OpenTime: "", CloseTime: "", isWorkingDay: false },
    Thursday: { OpenTime: "", CloseTime: "", isWorkingDay: false },
    Friday: { OpenTime: "", CloseTime: "", isWorkingDay: false },
    Saturday: { OpenTime: "", CloseTime: "", isWorkingDay: false },
    Sunday: { OpenTime: "", CloseTime: "", isWorkingDay: false },
  });

  const [timeErrors, setTimeErrors] = useState({}); // To track time validation errors


  const handleCloseDialog = () => {
    setShowInsert(false);
    if (onClose) onClose(); // Close the dialog by calling onClose if it's passed as a prop
  };

  const openDialog = () => {
    setApprovedDialogOpen(true);
  };

  const closeDialog = () => {
    setShowInsert(false); 
    if (onClose) onClose();
    setApprovedDialogOpen(false);

  };

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await axios.get("http://localhost:5196/api/Service");
      setServices(response.data);
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewService({ ...newService, [name]: value });
  };

  const handleKey = (e) => {
    if (e.key === "-" || e.key === '+') {
      e.preventDefault();
    }
  }

  const handleDayChange = (day, field, value) => {
    setDaysOfWeek((prevDays) => {
        const updatedDay = { ...prevDays[day], [field]: value };

        let error = ""; // To hold validation error message

        // Validation: Ensure CloseTime is after OpenTime
        if (field === 'OpenTime' && updatedDay.CloseTime) {
            const openTime = new Date(`1970-01-01T${value}:00`);
            const closeTime = new Date(`1970-01-01T${updatedDay.CloseTime}:00`);
            if (closeTime <= openTime) {
                error = "Close time must be after open time.";
            }
        } else if (field === 'CloseTime' && updatedDay.OpenTime) {
            const openTime = new Date(`1970-01-01T${updatedDay.OpenTime}:00`);
            const closeTime = new Date(`1970-01-01T${value}:00`);
            if (closeTime <= openTime) {
                error = "Close time must be after open time.";
            }
        }

        // Update timeErrors state
        setTimeErrors((prevErrors) => ({
            ...prevErrors,
            [day]: error,
        }));

        return {
            ...prevDays,
            [day]: updatedDay,
        };
    });
};
  const handleCheckboxChange = (day, field) => {
    setDaysOfWeek((prevDays) => ({
      ...prevDays,
      [day]: { ...prevDays[day], [field]: !prevDays[day][field] },
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewService({ ...newService, imageUrl: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddService = async () => {
    const data = {
      businessId: newService.businessId,
      serviceId: newService.serviceId,
      daysOfWeek: JSON.stringify(daysOfWeek),
      price: newService.price,
      imageUrl: newService.imageUrl,
    };

    // console.log(data);

    try {
      await axios.post("http://localhost:5196/api/BusinessService", data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
     
      setMessage("Insert")
      openDialog();
      // navigate(-1);
    } catch (error) {
      console.error("Error adding business service:", error);
    }
  };

  return (
    <div className="insert-business-service-card">
      <div className="insert-business-service-container">
        <h2 className="insert-business-service-title">Business Services</h2>

        <h3 className="insert-business-service-subtitle">
          Add New Business Service
        </h3>

        <div className="insert-business-service-row">
          <div className="insert-business-service-select-container">
            <div style={{ display: "flex", gap: "1.5rem" }}>
              <div>
                <label className="insert-business-service-label">Service</label>
                <select
                  className="insert-business-service-select"
                  name="serviceId"
                  value={newService.serviceId}
                  onChange={(e) => {
                    if (e.target.value === "add") {
                      navigate("/InsertService");
                    } else {
                      handleInputChange(e);
                    }
                  }}
                >
                  <option value="">Select Service</option>
                  {services.map((service) =>
                    service.isActive ? (
                      <option key={service.id} value={service.id}>
                        {service.name}
                      </option>
                    ) : null
                  )}
                  <option value="add">+ Add New Service</option>
                </select>
              </div>
              <div>
                <label className="insert-business-service-label">Price:</label>
                <input
                  type="number"
                  className="insert-business-service-input"
                  name="price"
                  min="0"
                  onKeyDown={handleKey}
                  value={newService.price}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
        </div>

        <h4 className="insert-business-service-days-title">
          Set Days of Operation
        </h4>
        <div className="insert-business-service-days-container">
          {Object.keys(daysOfWeek).map((day) => (
            <div className="insert-business-service-day" key={day}>
              <h5>{day}</h5>
              <label>
                <input
                  type="checkbox"
                  checked={daysOfWeek[day].isWorkingDay}
                  onChange={() => handleCheckboxChange(day, "isWorkingDay")}
                />
                Working Day
              </label>
              {daysOfWeek[day].isWorkingDay && (
                <div className="insert-business-service-time-container">
                  <label>
                    Open Time:
                    <input
                      type="time"
                      value={daysOfWeek[day].OpenTime}
                      onChange={(e) => handleDayChange(day, 'OpenTime', e.target.value)}
                    />
                  </label>
                  <label>
                    Close Time:
                    <input
                      type="time"
                      value={daysOfWeek[day].CloseTime}
                      onChange={(e) => handleDayChange(day, 'CloseTime', e.target.value)}
                    />
                  </label>
                  {timeErrors[day] && (
                    <p style={{ color: 'red', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                      {timeErrors[day]}
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="insert-business-service-row">
          <div className="insert-business-service-upload">
            <label className="insert-business-service-label">
              Upload Image:
            </label>
            <input
              type="file"
              className="insert-business-service-file"
              onChange={handleImageChange}
            />
          </div>
        </div>

        <div className="insert-businessservice-button-container">
          <button
            type="button"
            className="insert-businessservice-insert-btn"
            onClick={handleAddService}
          >
            Add Business Service
          </button>

          <button
            type="button"
            onClick={handleCloseDialog}
            className="insert-businessservice-cancel-btn"
          >
            Cancel
          </button>
        </div>
      </div>
      {approvedDialogOpen && <ApprovedDialogComponent onClose={closeDialog} message={message} />}

    </div>
  );
};

export default InsertBusinessService;
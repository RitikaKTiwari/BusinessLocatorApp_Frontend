import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './UpdateBusinessService.css';
import ApprovedDialogComponent from '../../User/DialogComponent/ApprovedDialogComponent';


const UpdateBusinessService = ({ onClose, businessServiceId }) => {
    const businessId = localStorage.getItem("businessId");
    const navigate = useNavigate();
      const [approvedDialogOpen, setApprovedDialogOpen] = useState(false);
      const [message, setMessage] = useState({});
    const [services, setServices] = useState([]);
    const [businessService, setBusinessService] = useState({
        businessId: businessId,
        serviceId: '',
        daysOfWeek: {},
        price: null,
    });

    const [daysOfWeek, setDaysOfWeek] = useState({
        Monday: { OpenTime: '', CloseTime: '', isWorkingDay: false },
        Tuesday: { OpenTime: '', CloseTime: '', isWorkingDay: false },
        Wednesday: { OpenTime: '', CloseTime: '', isWorkingDay: false },
        Thursday: { OpenTime: '', CloseTime: '', isWorkingDay: false },
        Friday: { OpenTime: '', CloseTime: '', isWorkingDay: false },
        Saturday: { OpenTime: '', CloseTime: '', isWorkingDay: false },
        Sunday: { OpenTime: '', CloseTime: '', isWorkingDay: false },
    });

    useEffect(() => {
        fetchServices();
        fetchBusinessService();
    }, []);

    const fetchServices = async () => {
        try {
            const response = await axios.get("http://localhost:5196/api/Service");
            setServices(response.data);
        } catch (error) {
            console.error("Error fetching services:", error);
        }
    };

    const fetchBusinessService = async () => {
        try {
            const response = await axios.get(`http://localhost:5196/api/BusinessService/${businessServiceId}`);
            const fetchedService = response.data;
            const formattedDays = fetchedService.daysOfWeekFormatted.split(", ");
            const parsedDaysOfWeek = { ...daysOfWeek };

            formattedDays.forEach((dayString) => {
                const [day, timings] = dayString.split(": ");
                if (day && timings) {
                    if (timings === "Closed") {
                        parsedDaysOfWeek[day] = {
                            isWorkingDay: false,
                            OpenTime: "",
                            CloseTime: "",
                        };
                    } else {
                        const [openTime, closeTime] = timings.split(" - ");
                        parsedDaysOfWeek[day] = {
                            isWorkingDay: true,
                            OpenTime: openTime,
                            CloseTime: closeTime,
                        };
                    }
                }
            });

            setBusinessService(fetchedService);
            setDaysOfWeek(parsedDaysOfWeek);
        } catch (error) {
            console.error("Error fetching business service:", error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setBusinessService({ ...businessService, [name]: value });
    };

    const handleDayChange = (day, field, value) => {
        setDaysOfWeek((prevDays) => ({
            ...prevDays,
            [day]: { ...prevDays[day], [field]: value },
        }));
    };

    const handleKey=(e)=>{
        if(e.key==="-" || e.key==='+'){
          e.preventDefault();
        }
      }

    const handleCheckboxChange = (day) => {
        setDaysOfWeek((prevDays) => ({
            ...prevDays,
            [day]: { ...prevDays[day], isWorkingDay: !prevDays[day].isWorkingDay },
        }));
    };

    const updateService = async () => {
        try {
            const request = {
                ...businessService,
                daysOfWeek: JSON.stringify(daysOfWeek),
            };
            await axios.put(`http://localhost:5196/api/BusinessService/${businessServiceId}`, request);
            setMessage("Update")
            openDialog(); 
            
                      // if (onClose) onClose();
        } catch (error) {
            console.error("Error updating business service:", error);
        }
    };
        
    
    
  const openDialog = () => {
    setApprovedDialogOpen(true);
  };

  const closeDialog = () => {
   // if (onClose) onClose();
    setApprovedDialogOpen(false);

  };

    const handleCloseDialog = () => {
        if (onClose) onClose();
    };

    return (
        <div className='update-business-service-card'>
            <div className="update-business-service-container">
                <h2 className='update-business-service-title'>Update Business Services</h2>
                <h3 className='update-business-service-subtitle'>Edit Business Service</h3>
                
                <div className="update-business-service-row">
                    <div className="update-business-service-select-container">
                        <div style={{ display: 'flex', gap: '1.5rem' }}>
                            <div>
                                <label className="update-business-service-label">Service:</label>
                                <select
                                    name="serviceId"
                                    className="update-business-service-select"
                                    value={businessService.serviceId}
                                    onChange={(e) => handleInputChange(e)}
                                >
                                    <option value="">Select Service</option>
                                    {services.map((service) => (
                                        service.isActive && (
                                            <option key={service.id} value={service.id}>{service.name}</option>
                                        )
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="update-business-service-label">Price:</label>
                                <input
                                    type="number"
                                    className="update-business-service-input"
                                    name="price"
                                    min="0"
                                    onKeyDown={handleKey}
                                    value={businessService.price || ''}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <h4 className="update-business-service-days-title">Set Days of Operation</h4>
                <div className="update-business-service-days-container">
                    {Object.keys(daysOfWeek).map((day) => (
                        <div key={day} className="update-business-service-day">
                            <h5>{day}</h5>
                            <label>
                                <input
                                    type="checkbox"
                                    checked={daysOfWeek[day]?.isWorkingDay}
                                    onChange={() => handleCheckboxChange(day)}
                                /> Working Day
                            </label>
                            {daysOfWeek[day]?.isWorkingDay && (
                                <div className="update-business-service-time-container">
                                    <label>Open Time:
                                        <input
                                            type="time"
                                            value={daysOfWeek[day]?.OpenTime || ''}
                                            onChange={(e) => handleDayChange(day, 'OpenTime', e.target.value)}
                                        />
                                    </label>
                                    <label>Close Time:
                                        <input
                                            type="time"
                                            value={daysOfWeek[day]?.CloseTime || ''}
                                            onChange={(e) => handleDayChange(day, 'CloseTime', e.target.value)}
                                        />
                                    </label>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="update-businessservice-button-container">
                    <button className="update-businessservice-update-btn" onClick={updateService}>Save Business Service</button>
                    <button className="update-businessservice-cancel-btn" onClick={handleCloseDialog}>Cancel</button>
                </div>
            </div>
            {approvedDialogOpen && <ApprovedDialogComponent onClose={closeDialog} message={message} />}

        </div>
    );
};

export default UpdateBusinessService;

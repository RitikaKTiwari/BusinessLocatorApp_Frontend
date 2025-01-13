import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ViewMyServices.css';
import { useNavigate } from 'react-router-dom';
import d from '../../../image/delete.png';
import edit from '../../../image/edit.png'
import DeleteDialogComponent from '../../DialogComponent/DeleteDialogComponent';
import InsertBusinessService from '../../BusinessService/InsertBusinessService'
import UpdateBusinessService from '../../BusinessService/UpdateBusinessService';

const ViewMyServices = () => {
    const [services, setServices] = useState([]);
    const [selectedService, setSelectedService] = useState(null);
    const [technician, setTechician] = useState([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false); // State for Add Technician modal
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false); // State for Update Technician modal
    const [OpenDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [businessserviceid, setBusinessserviceid] = useState(0);
    const [serviceImages, setServiceImages] = useState({}); // To store images for each service
    const navigate = useNavigate();

    const businessId = localStorage.getItem('businessId');

    useEffect(() => {
        fetchBusinessService();
    }, [services]);

    const openAddModal = () => {
        setIsAddModalOpen(true); // Open Add Technician modal
    };

    const closeAddModal = () => {
        setIsAddModalOpen(false);
    };

    const openDeleteDialogComponent = (id) => {
        setBusinessserviceid(id);
        setOpenDeleteDialog(true);
    };

    const closeDeleteDialogComponent = () => {
        setOpenDeleteDialog(false);
        fetchBusinessService();
    };

    const openUpdateModal = (businessServiceId) => {
        setSelectedService(businessServiceId);
        setIsUpdateModalOpen(true); // Open Update Technician modal
    };
    
    const closeUpdateModal = () => {
        setIsUpdateModalOpen(false);
        setSelectedService(null);
        fetchBusinessService(); // Optionally, fetch updated list after closing modal
    };
    

    const fetchBusinessService = async () => {
        const response = await axios.get(`http://localhost:5196/api/BusinessService/Business/${businessId}`);
        setServices(response.data);

        // Fetch images for each business service
        for (const service of response.data) {
            fetchServiceImages(service.id);
        }
    };

    const fetchServiceImages = async (businessServiceId) => {
        try {
            const response = await axios.get(`http://localhost:5196/api/BusinessService/Images/${businessServiceId}`);
            console.log(response.data);
            setServiceImages(prev => ({
                ...prev,
                [businessServiceId]: response.data // Store the images by businessServiceId
            }));
        } catch (error) {
            console.error("Error fetching images:", error);
        }
    };

    const handleUpdate = (businessServiceId) => {
        navigate(`/UpdateBusinessService/${businessServiceId}`);
    };

    const fetchTechnician = async (businessServiceId) => {
        if (!businessServiceId || isNaN(businessServiceId)) {
            console.error("Invalid businessServiceId");
            return;
        }

        try {
            const response = await axios.get(`http://localhost:5196/api/Technician/businessservice/${businessServiceId}/technicians`);
            setTechician(response.data);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    const toggleDetails = (id) => {
        if (selectedService === id) {
            setSelectedService(null); // Toggle off the service details
        } else {
            setSelectedService(id);
            fetchTechnician(id);
            // Toggle on the selected service
        }
    };

    const formatOperatingHours = (hours) => {
        return hours.split(',').map((dayTime, index) => {
            const separatorIndex = dayTime.indexOf(':');
            const day = dayTime.substring(0, separatorIndex).trim();
            const time = dayTime.substring(separatorIndex + 1).trim();
            return (
                <div key={index} className="day-time-row">
                    <span className="day">{day}</span>
                    <span className="time">{time}</span>
                </div>
            );
        });
    };

    return (
        <div className="business-business-profile-main-service-container">
            <h3>Manage your services</h3>
            <button className="techapprove-btn" onClick={openAddModal}>Add my service</button>

            {services.map((service) => (
                <div key={service.id} className="business-profile-main-service-card">
                    <div className="business-profile-main-service-header">
                        <div><strong>Service :</strong> {service.service.name}</div>
                        <div style={{ marginLeft: 350 }}><strong>Price :</strong> {service.price}</div>
                        <div className="business-profile-main-dropdown-icon" onClick={() => toggleDetails(service.id)}>
                            {selectedService === service.id ? (
                                <p>↓</p> // Down arrow
                            ) : (
                                <p>↑</p> // Up arrow
                            )}
                        </div>
                    </div>

                    <div className="business-profile-main-service-details">
                        <p><strong>Description:</strong> {service.service.description}</p>

                        {/* Render images if available */}
                        {serviceImages[service.id] && serviceImages[service.id].map((image, index) => (
                            <div key={index} className="business-main-home-service-image-div-ser">

                                <img src={image.imageUrl} alt={`Service ${index}`} className='business-main-home-service-image-ser' />
                            </div>
                        ))}

                        {selectedService === service.id && (
                            <div>
                                <div className="business-main-operating-hours">
                                    <p><strong>Operating Hours:</strong></p>
                                    {formatOperatingHours(service.daysOfWeekFormatted)}
                                </div>
                                <div className='business-main-operating-hours'>
                                    <p><strong>Technicians:</strong></p>
                                    {technician.length > 0 && (
                                        <ul>
                                            {technician.map((tech) => (
                                                <p key={tech.id}>
                                                    <p>Name: {tech.fullName}     Experience: {tech.experience}</p>
                                                </p>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="business-main-button-container">
                        <p><img src={edit} onClick={() =>  openUpdateModal(service.id) } width={20} height={20} style={{ marginLeft: 650 }}></img></p>
                        <p><img src={d} onClick={() => openDeleteDialogComponent(service.id)} width={20} height={20}></img></p>
                    </div>

                </div>

            ))}


            {isUpdateModalOpen && (
                <div className="techmodal-overlay">
                    <div className="techmodal-container">
                        <UpdateBusinessService
                            businessServiceId={selectedService}
                            onClose={closeUpdateModal} // Pass close function to UpdateTechnician
                        />
                    </div>
                </div>
            )}

            {isAddModalOpen && (
                <div className="techmodal-overlay">
                    <div className="techmodal-container">
                        <InsertBusinessService onClose={closeAddModal} /> {/* Add Technician modal */}
                    </div>
                </div>
            )}

            {OpenDeleteDialog && <DeleteDialogComponent onClose={closeDeleteDialogComponent} setMe={2} businessserviceid={businessserviceid} />}
        </div>
    );
};

export default ViewMyServices;

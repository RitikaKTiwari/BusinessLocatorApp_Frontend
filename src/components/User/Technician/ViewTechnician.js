import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ViewTechnician.css';
import { useNavigate } from 'react-router-dom';
import DeleteDialogComponent from '../DialogComponent/DeleteDialogComponent';
import UpdateTechnician from './UpdateTechnician'; // Import UpdateTechnician component
import InsertTechnician from './InsertTechnician';
import edit from '../../image/edit.png';
import d from '../../image/delete.png';

const ViewTechnician = () => {
    const [technicians, setTechnicians] = useState([]);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false); // State for Update Technician modal
    const [isAddModalOpen, setIsAddModalOpen] = useState(false); // State for Add Technician modal
    const [selectedTechnicianId, setSelectedTechnicianId] = useState(null); // Track the selected technician for editing
    const [OpenDeleteDialog, setOpenDeleteDialog] = useState(false);
    const businessId = localStorage.getItem('businessId');
    const [techid, setTechid] = useState(0);

   

    const openDeleteDialogComponent = (id) => {
        setTechid(id);
        setOpenDeleteDialog(true);
    };

    const closeDeleteDialogComponent = () => {
        setOpenDeleteDialog(false);
        fetchTechnicians();
    };

    const fetchTechnicians = async () => {
        try {
            const response = await axios.get(`http://localhost:5196/api/Technician/business/${businessId}`);
            console.log(response.data);
            setTechnicians(response.data);
        } catch (error) {
            console.error("Error fetching technicians:", error);
        }
    };

    const openUpdateModal = (technicianId) => {
        setSelectedTechnicianId(technicianId);
        setIsUpdateModalOpen(true); // Open Update Technician modal
    };

    const closeUpdateModal = () => {
        setIsUpdateModalOpen(false);
        setSelectedTechnicianId(null);
        fetchTechnicians(); // Optionally, fetch updated list after closing modal
    };

    const openAddModal = () => {
        setIsAddModalOpen(true); // Open Add Technician modal
    };

    const closeAddModal = () => {
        setIsAddModalOpen(false);
        fetchTechnicians(); // Optionally, fetch updated list after closing modal
    };
    useEffect(() => {
        fetchTechnicians();
    }, [technicians]);
    return (
        <div>
            <h1 className='tech-h1'>Technicians</h1>
            <div className='technician-con'>
                <button className="techapprove-btn" onClick={openAddModal}>Add Technician</button>
                {technicians.map((technician) => (
                    <div key={technician.id} className="technician-card">
                        <div className="technician-header">
                            <p><strong className='tech-strong'>Name:</strong> {technician.fullName}</p>
                            <p><strong className='tech-strong'>Experience:</strong> {technician.experience}</p>
                            <p><strong className='tech-strong'>Service:</strong> {technician.servicename}</p>
                            <div className="technician-actions">
                                <img src={edit} onClick={() => openUpdateModal(technician.id)} width={20} height={20} alt="edit" />
                                <img src={d} onClick={() => openDeleteDialogComponent(technician.id)} width={25} height={25} alt="delete" />
                            </div>
                        </div>
                        <div className="technician-details">
                            {/* Add any additional details here */}
                        </div>
                    </div>
                ))}


                {/* Modal Overlays */}
                {isUpdateModalOpen && (
                    <div className="modal-overlay">
                        <div className="modal-container">
                            <UpdateTechnician
                                technicianId={selectedTechnicianId}
                                onClose={closeUpdateModal} // Pass close function to UpdateTechnician
                            />
                        </div>
                    </div>
                )}

                {isAddModalOpen && (
                    <div className="techmodal-overlay">
                        <div className="techmodal-container">
                            <InsertTechnician onClose={closeAddModal} /> {/* Add Technician modal */}
                        </div>
                    </div>
                )}

                {OpenDeleteDialog && <DeleteDialogComponent onClose={closeDeleteDialogComponent} setMe={1} techid={techid} />}
            </div>
        </div>
    );
};

export default ViewTechnician;

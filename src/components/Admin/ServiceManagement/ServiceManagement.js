import React, { useState, useEffect } from "react";
import axios from "axios";
import "../Management.css";
import ApprovedDialogComponent from '../../User/DialogComponent/ApprovedDialogComponent';


const ServiceManagement = () => {
  const [services, setServices] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [approvedDialogOpen, setApprovedDialogOpen] = useState(false);

  const [dataPerPage] = useState(5);
  const [sortConfig, setSortConfig] = useState({
    key: "id",
    direction: "ascending",
  });
  const [editMode, setEditMode] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [addMode, setAddMode] = useState(false);
  const [newService, setNewService] = useState("");
  const [message, setMessage] = useState("");

  // Sort services based on the sortConfig
  const sortedServices = [...services].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "ascending" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "ascending" ? 1 : -1;
    }
    return 0;
  });

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
    setCurrentPage(1);
  };

  const getSortIcon = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "ascending" ? "↑" : "↓";
    }
    return "↕";
  };

  useEffect(() => {
    fetchServices();
    fetchSubCategories();
  }, []);

  const openDialog = () => {
    setApprovedDialogOpen(true);
  };

  const closeDialog = () => {
    setApprovedDialogOpen(false);
  };

  const indexOfLastData = currentPage * dataPerPage;
  const indexOfFirstData = indexOfLastData - dataPerPage;
  const currentData = sortedServices.slice(indexOfFirstData, indexOfLastData);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const fetchServices = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5196/api/Service/Admin/GetAllServices"
      );
      setServices(response.data);
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  const fetchSubCategories = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5196/api/Subcategory/Admin/GetAllSubCategories"
      );
      setSubCategories(response.data);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    }
  };

  const handleRowDoubleClick = (service) => {
    const subCategory = subCategories.find(
      (sub) => sub.name === service.subCategoryName
    );
    setSelectedService({
      ...service,
      subCategoryId: subCategory ? subCategory.id : "",
    });
    setEditMode(true);
  };

  const handleSave = async () => {
    try {
      const updatedService = { ...selectedService };
      await axios.put(
        `http://localhost:5196/api/Service/${selectedService.id}`,
        updatedService
      );

      setServices((prevServices) =>
        prevServices.map((service) =>
          service.id === selectedService.id ? updatedService : service
        )
      );

      setMessage("Update");
      openDialog();
      setEditMode(false);
      setSelectedService(null);
      fetchServices();
      fetchSubCategories();
    } catch (error) {
      console.error("Error updating service:", error);
    }
  };

  const handleCancel = () => {
    setAddMode(false);
    setEditMode(false);
    setSelectedService(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (editMode) {
      setSelectedService((prevService) => ({
        ...prevService,
        [name]: name === "isActive" ? value === "Active" : value,
      }));
    } else if (addMode) {
      setNewService((prevService) => ({
        ...prevService,
        [name]: value,
      }));
    }
  };

  const handleAddService = async () => {
    try {
      await axios.post("http://localhost:5196/api/Service", {
        name: newService.name,
        description: newService.description,
        subcategoryId: newService.subcategoryId,
      });
      setNewService("");
      setMessage("Insert");
      openDialog();
      setAddMode(false);
      fetchServices();
      fetchSubCategories();
    } catch (error) {
      console.error("Error inserting subcategory:", error);
    }
  };

  return (
    <div className="management-container">
      <h1>Service Management</h1>
      {!editMode && !addMode ? (
        <>
          <button
            className="add-management-button"
            onClick={() => {
              setNewService("");
              setMessage("");
              setAddMode(true);
            }}
          >
            Add Service
          </button>

          <table className="management-table">
            <thead>
              <tr>
                <th onClick={() => requestSort("id")}>
                  Id {getSortIcon("id")}
                </th>
                <th onClick={() => requestSort("name")}>
                  Name {getSortIcon("name")}
                </th>
                <th onClick={() => requestSort("subCategoryName")}>
                  Subcategory {getSortIcon("subCategoryName")}
                </th>
                <th onClick={() => requestSort("description")}>
                  Description {getSortIcon("description")}
                </th>
                <th onClick={() => requestSort("isActive")}>
                  Status {getSortIcon("isActive")}
                </th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((service) => (
                <tr
                  key={service.id}
                  onDoubleClick={() => handleRowDoubleClick(service)}
                >
                  <td>{service.id}</td>
                  <td>{service.name}</td>
                  <td>{service.subCategoryName}</td>
                  <td>{service.description}</td>
                  <td
                    style={{
                      color: service.isActive ? "green" : "red",
                      fontWeight: "bold",
                    }}
                  >
                    {service.isActive ? "Active" : "Inactive"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="pagination">
            <button
              className="pagination-button"
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span>
              Page {currentPage} of {Math.ceil(services.length / dataPerPage)}
            </span>
            <button
              className="pagination-button"
              onClick={() => paginate(currentPage + 1)}
              disabled={
                currentPage === Math.ceil(services.length / dataPerPage)
              }
            >
              Next
            </button>
          </div>
        </>
      ) : editMode ? (
        <div className="adminsidemanage-edit-form">
          <h3 className="admin-sidemanager-edit-form-title">Edit Service</h3>
          <form className="admin-sidemanager-edit-form">
            <div className="adminside-edit-form-group ">
              <label className="ad-label">Name:</label>
              <input
                className="adminside-input-fieldd"
                type="text"
                name="name"
                value={selectedService.name || ""}
                onChange={handleChange}
              />
            </div>
            <div className="adminside-edit-form-group">
              <label className="ad-label">SubCategory:</label>
              <select
                className="adminside-input-fieldd"
                name="subCategoryId"
                value={selectedService.subCategoryId || ""}
                onChange={handleChange}
              >
                <option value="">Select Subcategory</option>
                {subCategories.map((subCategory) =>
                  subCategory.isActive ? (
                    <option key={subCategory.id} value={subCategory.id}>
                      {subCategory.name}
                    </option>
                  ) : null
                )}
              </select>
            </div>
            <div className="adminside-edit-form-group">
              <label className="ad-label">Description:</label>
              <textarea
                className="adminside-input-fieldd"
                name="description"
                value={selectedService.description || ""}
                onChange={handleChange}
              />
            </div>
            <div className="adminside-edit-form-group">
              <label className="ad-label">Status:</label>
              <select
                className="admin-sidemanager-fieldd"
                name="isActive"
                value={selectedService.isActive ? "Active" : "Inactive"}
                onChange={handleChange}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            <div className="adminside-button-section">
              <button
                className="adminside-btn-primary"
                type="button"
                onClick={handleSave}
              >
                Save
              </button>
              <button
                className="adminside-btn-secondary"
                type="button"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="adminsidemanage-edit-form">
          <h1 className="admin-sidemanager-edit-form-title">Add New Service</h1>
          <form onSubmit={(e) => e.preventDefault()}>
            {/* <div className="insert-input-section">
                                <div className="admin-side-form"> */}
            <div className="adminside-edit-form-group">
              <label htmlFor="name" className="ad-label">
                Name:
              </label>
              <input
                type="text"
                name="name"
                placeholder="Enter new service name"
                value={newService.name}
                onChange={handleChange}
                className="adminside-input-fieldd"
              />
            </div>

            <div className="adminside-edit-form-group">
              <label htmlFor="description" className="ad-label">
                Description:
              </label>
              <textarea
                name="description"
                placeholder="Enter description"
                value={newService.description}
                onChange={handleChange}
                className="adminside-input-fieldd"
              />
            </div>

            <div className="adminside-edit-form-group">
              <label htmlFor="subcategoryId" className="ad-label">
                SubCategory:
              </label>

              <select
                name="subcategoryId"
                value={newService.subcategoryId}
                onChange={handleChange}
                className="adminside-input-fieldd"
              >
                <option value="">Select SubCategory</option>
                {subCategories.map((subCategory) =>
                  subCategory.isActive ? (
                    <option key={subCategory.id} value={subCategory.id}>
                      {subCategory.name}
                    </option>
                  ) : null
                )}
              </select>
            </div>
            {/* </div>
                            </div> */}

            <div className="adminside-button-section">
              <button
                className="adminside-btn-primary"
                type="button"
                onClick={handleAddService}
              >
                Add
              </button>
              <button
                className="adminside-btn-secondary"
                type="button"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
            {message && (
              <p
                className={`message ${message.includes("success") ? "success" : "error"
                  }`}
              >
                {message}
              </p>
            )}
          </form>
        </div>
      )}
      {approvedDialogOpen && <ApprovedDialogComponent onClose={closeDialog} message={message} />}

    </div>
  );
};

export default ServiceManagement;

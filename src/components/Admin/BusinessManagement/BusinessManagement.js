import React, { useEffect, useState } from "react";
import axios from "axios";
import "../Management.css";
import { useNavigate } from "react-router-dom";
import ApprovedDialogComponent from '../../User/DialogComponent/ApprovedDialogComponent';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
} from "@mui/material";

const BusinessManagement = () => {
  const [businesses, setBusinesses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [businessesPerPage] = useState(5);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });
  const [selectedBusiness, setSelectedBusiness] = useState(null); // Hold the selected business
  const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [approvedDialogOpen, setApprovedDialogOpen] = useState(false);
    const [message, setMessage] = useState("");
  
  
  const navigate = useNavigate();

  const handleAdd = () => {
    navigate("/AdminAddBusiness");
  };

  const fetchBusinesses = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:5196/api/Business/All"
      );
      setBusinesses(response.data);
    } catch (err) {
      setError("Failed to fetch businesses.");
    } finally {
      setLoading(false);
    }
  };
  const openDialog = () => {
    setApprovedDialogOpen(true);
  };

  const closeDialog = () => {
    setApprovedDialogOpen(false);
  };

  const handleBusinessClick = (business) => {
    if (!business || !business.id) {
      setError("Business ID is undefined.");
      return;
    }
    setSelectedBusiness(business);
    setEditDialogOpen(true);
  };

  const handleEditSubmit = async () => {
    if (!selectedBusiness || !selectedBusiness.id) {
      setError("Selected business or its ID is undefined.");
      return;
    }

    try {
      const updatedBusiness = {
        ...selectedBusiness,
        isActive: selectedBusiness.isActive,
      };

      await axios.delete(
        `http://localhost:5196/api/Business/${selectedBusiness.id}`,
        updatedBusiness
      );
      setMessage("Update");
      openDialog();

      setBusinesses((prevBusinesses) =>
        prevBusinesses.map((business) =>
          business.id === updatedBusiness.id ? updatedBusiness : business
        )
      );

      console.log(
        `Business with ID ${selectedBusiness.id} updated successfully.`
      );
      setEditDialogOpen(false);
    } catch (err) {
      console.error("Failed to update the business:", err);
      setError("Failed to update the business. Please try again.");
    }
  };

  const handleDialogClose = () => {
    setEditDialogOpen(false);
    setSelectedBusiness(null); // Clear selected business on close
  };

  useEffect(() => {
    fetchBusinesses();
  }, []);

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });

    const sortedBusinesses = [...businesses].sort((a, b) => {
      if (a[key] === null || b[key] === null) return 0;
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
      if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
      return 0;
    });
    setBusinesses(sortedBusinesses);
  };

  const indexOfLastBusiness = currentPage * businessesPerPage;
  const indexOfFirstBusiness = indexOfLastBusiness - businessesPerPage;
  const currentBusinesses = businesses.slice(
    indexOfFirstBusiness,
    indexOfLastBusiness
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const getSortingIcon = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "asc" ? "↑" : "↓";
    }
    return "↑";
  };

  return (
    <div className="management-container">
      <h1>Business Management</h1>
      {/* <button onClick={handleAdd} className="add-management-button">Add Business</button> */}
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && !error && (
        <>
          <table className="management-table">
            <thead>
              <tr>
                <th onClick={() => handleSort("name")}>
                  Name {getSortingIcon("name")}
                </th>
                <th onClick={() => handleSort("email")}>
                  Email {getSortingIcon("email")}
                </th>
                <th onClick={() => handleSort("contactNo")}>
                  Contact No {getSortingIcon("contactNo")}
                </th>
                <th onClick={() => handleSort("description")}>
                  Description {getSortingIcon("description")}
                </th>
                <th onClick={() => handleSort("address?.street")}>
                  Street {getSortingIcon("address?.street")}
                </th>
                <th onClick={() => handleSort("address?.location")}>
                  Location {getSortingIcon("address?.location")}
                </th>
                <th onClick={() => handleSort("isActive")}>
                  IsActive {getSortingIcon("isActive")}
                </th>
              </tr>
            </thead>
            <tbody>
              {currentBusinesses.map((business) => (
                <tr
                  key={business.id}
                  onDoubleClick={() => handleBusinessClick(business)}
                >
                  <td>{business.name}</td>
                  <td>{business.email}</td>
                  <td>{business.contactNo}</td>
                  <td>{business.description}</td>
                  <td>{business.address?.street || "N/A"}</td>
                  <td>{business.address?.location || "N/A"}</td>
                  <td
                    style={{
                      color: business.isActive ? "green" : "red",
                      fontWeight: "bold",
                    }}
                  >
                    {business.isActive ? "Active" : "Inactive"}
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
              Page {currentPage} of{" "}
              {Math.ceil(businesses.length / businessesPerPage)}
            </span>
            <button
              className="pagination-button"
              onClick={() => paginate(currentPage + 1)}
              disabled={
                currentPage === Math.ceil(businesses.length / businessesPerPage)
              }
            >
              Next
            </button>
          </div>
        </>
      )}

      {/* Edit Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={handleDialogClose}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Edit Business</DialogTitle>
        <DialogContent>
          {selectedBusiness && (
            <>
              <TextField
                select
                label="Status"
                fullWidth
                margin="dense"
                value={selectedBusiness.isActive}
                onChange={(e) =>
                  setSelectedBusiness({
                    ...selectedBusiness,
                    isActive: e.target.value === "true",
                  })
                } // Convert string to boolean
              >
                <MenuItem value={true}>Active</MenuItem>
                <MenuItem value={false}>Inactive</MenuItem>
              </TextField>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleEditSubmit} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
      {approvedDialogOpen && <ApprovedDialogComponent onClose={closeDialog} message={message} />}

    </div>
  );
};

export default BusinessManagement;

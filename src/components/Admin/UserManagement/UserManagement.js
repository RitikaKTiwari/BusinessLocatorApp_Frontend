import React, { useState, useEffect } from "react";
import axios from "axios";
import "../Management.css";
import ApprovedDialogComponent from '../../User/DialogComponent/ApprovedDialogComponent';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  MenuItem,
  TextField,
} from "@mui/material";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [sortConfig, setSortConfig] = useState({
    key: "id",
    direction: "ascending",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [addMode, setAddMode] = useState(false);
  const [newUser, setNewUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    contactNo: "",
  });
  const [approvedDialogOpen, setApprovedDialogOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5196/api/User`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setUsers(response.data);
      setLoading(false);
    } catch (err) {
      setError("Error fetching users. Please try again.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [selectedUser]);

  const totalPages = Math.ceil(users.length / itemsPerPage);
  const currentUsers = users.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (direction) => {
    setCurrentPage((prev) =>
      Math.min(Math.max(prev + direction, 1), totalPages)
    );
  };
  const openDialog = () => {
    setApprovedDialogOpen(true);
  };

  const closeDialog = () => {
    setApprovedDialogOpen(false);
  };

  const sortedUsers = [...users].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key])
      return sortConfig.direction === "ascending" ? -1 : 1;
    if (a[sortConfig.key] > b[sortConfig.key])
      return sortConfig.direction === "ascending" ? 1 : -1;
    return 0;
  });

  const requestSort = (key) => {
    const direction =
      sortConfig.key === key && sortConfig.direction === "ascending"
        ? "descending"
        : "ascending";
    setSortConfig({ key, direction });
    setUsers(sortedUsers);
  };

  const getSortIcon = (key) =>
    sortConfig.key === key
      ? sortConfig.direction === "ascending"
        ? "↑"
        : "↓"
      : "↕";

  const handleRowDoubleClick = (user) => {
    setSelectedUser({ ...user });
    console.log(user);
    console.log(selectedUser);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!selectedUser) {
      alert("No user selected!");
      return;
    }

    try {
      console.log(selectedUser);
      await axios.delete(`http://localhost:5196/api/User/${selectedUser.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setMessage("Update");
      openDialog();
      setDialogOpen(false);
      fetchUsers();
      setSelectedUser(null);
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Failed to update user. Please try again.");
    }
  };

  const handleCancel = () => {
    setAddMode(false);
    setDialogOpen(false);
    setSelectedUser(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setNewUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleAddUser = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5196/api/UserAuth/register",
        newUser
      );
      if (response.data.success) {
        alert("User added successfully");
        setAddMode(false);
        fetchUsers();
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      console.error("Registration error:", error);
      setError(
        error.response?.data?.message ||
        "Registration failed. Please try again."
      );
    }
  };

  if (loading) return <p>Loading users...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="management-container">
      <h1>User Management</h1>
      {!addMode ? (
        <>
          {/* <button className="add-management-button" onClick={() => { setNewUser(""); setMessage(""); setAddMode(true); }}>Add User</button> */}

          <table className="management-table">
            <thead>
              <tr>
                <th onClick={() => requestSort("id")}>
                  Id {getSortIcon("id")}
                </th>
                <th onClick={() => requestSort("name")}>
                  Name {getSortIcon("name")}
                </th>
                <th onClick={() => requestSort("email")}>
                  Email {getSortIcon("email")}
                </th>
                <th onClick={() => requestSort("contactNo")}>
                  Contact No.{getSortIcon("contactNo")}
                </th>
                <th onClick={() => requestSort("isActive")}>
                  IsActive {getSortIcon("isActive")}
                </th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map((user) => (
                <tr
                  key={user.id}
                  onDoubleClick={() => handleRowDoubleClick(user)}
                >
                  <td>{user.id}</td>
                  <td>{user.firstName + " " + user.lastName}</td>
                  <td>{user.email}</td>
                  <td>{user.contactNo}</td>
                  <td
                    style={{
                      color: user.isActive ? "green" : "red",
                      fontWeight: "bold",
                    }}
                  >
                    {user.isActive ? "Active" : "Inactive"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : (
        <div className="insert-management-container">
          <h1>Add New User</h1>
          <form
            className="insert-management-form"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="text"
              name="firstName"
              placeholder="Enter first name"
              value={newUser.firstName}
              onChange={handleChange}
            />

            <input
              type="text"
              name="lastName"
              placeholder="Enter last name"
              value={newUser.lastName}
              onChange={handleChange}
            />

            <input
              type="text"
              name="email"
              placeholder="Enter email"
              value={newUser.email}
              onChange={handleChange}
            />

            <input
              type="text"
              name="password"
              placeholder="Enter password"
              value={newUser.password}
              onChange={handleChange}
            />

            <input
              type="text"
              name="contactNo"
              placeholder="Enter contactno."
              value={newUser.contactNo}
              onChange={handleChange}
            />

            <div className="adminsidemanage-form-buttons">
              <button type="button" onClick={handleAddUser}>
                Add
              </button>
              <button type="button" onClick={handleCancel}>
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

      <div className="pagination">
        <button
          className="pagination-button"
          onClick={() => handlePageChange(-1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="pagination-button"
          onClick={() => handlePageChange(1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>

      {selectedUser && (
        <Dialog
          open={dialogOpen}
          onClose={handleCancel}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>Edit User Status</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Status"
              name="isActive"
              margin="dense"
              value={selectedUser?.isActive ? "Active" : "Inactive"}
              onChange={(e) =>
                setSelectedUser({
                  ...selectedUser,
                  isActive: e.target.value === "Active",
                })
              }
              select
            >
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Inactive">Inactive</MenuItem>
            </TextField>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleSave}>Save</Button>
            <Button onClick={handleCancel}>Cancel</Button>
          </DialogActions>
        </Dialog>
      )}
      {approvedDialogOpen && <ApprovedDialogComponent onClose={closeDialog} message={message} />}

    </div>
  );
};

export default UserManagement;

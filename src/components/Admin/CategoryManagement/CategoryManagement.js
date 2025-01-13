import React, { useState, useEffect } from "react";
import axios from "axios";
import "../Management.css";
import ApprovedDialogComponent from '../../User/DialogComponent/ApprovedDialogComponent';

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [dataPerPage] = useState(5); // Show 2 records per page
  const [sortConfig, setSortConfig] = useState({
    key: "id",
    direction: "ascending",
  });
  const [editMode, setEditMode] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [addMode, setAddMode] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [message, setMessage] = useState("");
  const [approvedDialogOpen, setApprovedDialogOpen] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5196/api/Category/Admin/GetAllCategories"
      );
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const sortedCategories = [...categories].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "ascending" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "ascending" ? 1 : -1;
    }
    return 0;
  });
  const openDialog = () => {
    setApprovedDialogOpen(true);
  };

  const closeDialog = () => {
    setApprovedDialogOpen(false);
  };
  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
    setCurrentPage(1); // Reset to the first page after sorting
  };

  const getSortIcon = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "ascending" ? "↑" : "↓";
    }
    return "↕";
  };

  // Pagination logic applied after sorting
  const indexOfLastData = currentPage * dataPerPage;
  const indexOfFirstData = indexOfLastData - dataPerPage;
  const currentData = sortedCategories.slice(indexOfFirstData, indexOfLastData);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleRowDoubleClick = (category) => {
    setSelectedCategory({ ...category });
    setEditMode(true);
  };

  const handleSave = async () => {
    try {
      const updatedCategory = { ...selectedCategory };

      await axios.put(
        `http://localhost:5196/api/Category/${selectedCategory.id}`,
        updatedCategory
      );
      setCategories((prevCategories) =>
        prevCategories.map((category) =>
          category.id === selectedCategory.id ? updatedCategory : category
        )
      );
      setMessage("Update");
      openDialog();
      setEditMode(false);
      setSelectedCategory(null);
    } catch (error) {
      console.error("Error updating category:", error);
    }
  };

  const handleCancel = () => {
    setAddMode(false);
    setEditMode(false);
    setSelectedCategory(null);
  };

  const handleAddCategory = async () => {
    try {
      await axios.post("http://localhost:5196/api/Category", {
        name: newCategory,
      });
      setNewCategory("");
      setMessage("Insert");
      openDialog();

      setAddMode(false);
      fetchCategories(); // Refresh the category list
    } catch (error) {
      console.error("Error inserting category:", error);
      setMessage("Error adding category.");
    }
  };

  return (
    <div className="management-container">
      <h1>Category Management</h1>
      {!editMode && !addMode ? (
        <>
          <button
            className="add-management-button"
            onClick={() => {
              setNewCategory("");
              setMessage("");
              setAddMode(true);
            }}
          >
            Add Category
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
                <th onClick={() => requestSort("isActive")}>
                  Status {getSortIcon("isActive")}
                </th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((category) => (
                <tr
                  key={category.id}
                  onDoubleClick={() => handleRowDoubleClick(category)}
                >
                  <td>{category.id}</td>
                  <td>{category.name}</td>
                  <td
                    style={{
                      color: category.isActive ? "green" : "red",
                      fontWeight: "bold",
                    }}
                  >
                    {category.isActive ? "Active" : "Inactive"}
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
              Page {currentPage} of {Math.ceil(categories.length / dataPerPage)}
            </span>
            <button
              className="pagination-button"
              onClick={() => paginate(currentPage + 1)}
              disabled={
                currentPage === Math.ceil(categories.length / dataPerPage)
              }
            >
              Next
            </button>
          </div>
        </>
      ) : editMode ? (
        <div className="adminsidemanage-edit-form">
          <h3 className="admin-sidemanager-edit-form-title">Edit Category</h3>
          <form className="admin-sidemanager-edit-form">
            <div className="adminside-edit-form-group ">
              <label className="ad-label">Name:</label>
              <input
                className="adminside-input-fieldd"
                type="text"
                name="name"
                value={selectedCategory.name}
                onChange={(e) =>
                  setSelectedCategory({
                    ...selectedCategory,
                    name: e.target.value,
                  })
                }
              />
            </div>
            <div className="adminside-edit-form-group ">
              <label className="ad-label">Status:</label>
              <select
                className="admin-sidemanager-fieldd"
                name="isActive"
                value={selectedCategory.isActive ? "Active" : "Inactive"}
                onChange={(e) =>
                  setSelectedCategory({
                    ...selectedCategory,
                    isActive: e.target.value === "Active",
                  })
                }
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
        // <div className="insert-management-container">
        <div className="adminsidemanage-edit-form">
          <h1 className="admin-sidemanager-edit-form-title">
            Add New Category
          </h1>
          <form onSubmit={(e) => e.preventDefault()}>
            {/* <div className="insert-input-section"> */}
            {/* <div className="admin-side-form"> */}
            <div className="adminside-edit-form-group">
              <label htmlFor="name" className="ad-label">
                Name:
              </label>
              <input
                className="adminside-input-fieldd"
                type="text"
                placeholder="Enter new category name"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
              />
            </div>
            {/* </div> */}
            {/* </div> */}
            <div className="adminside-button-section">
              <button
                className="adminside-btn-primary"
                type="button"
                onClick={handleAddCategory}
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
        // </div>
      )}
      {approvedDialogOpen && <ApprovedDialogComponent onClose={closeDialog} message={message} />}

    </div>
  );
};

export default CategoryManagement;

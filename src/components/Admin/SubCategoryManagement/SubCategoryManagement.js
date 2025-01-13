import React, { useState, useEffect } from "react";
import axios from "axios";
import "../Management.css";
import ApprovedDialogComponent from '../../User/DialogComponent/ApprovedDialogComponent';


const SubcategoryManagement = () => {
  const [subcategories, setSubcategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [dataPerPage] = useState(5);
  const [sortConfig, setSortConfig] = useState({
    key: "id",
    direction: "ascending",
  });
  const [editMode, setEditMode] = useState(false);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [addMode, setAddMode] = useState(false);
  const [newSubCategory, setNewSubCategory] = useState("");
    const [approvedDialogOpen, setApprovedDialogOpen] = useState(false);
  
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchSubcategories();
    fetchCategories();
  }, []);

  const fetchSubcategories = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5196/api/SubCategory/Admin/GetAllSubCategories"
      );
      setSubcategories(response.data);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    }
  };

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
  const openDialog = () => {
    setApprovedDialogOpen(true);
  };

  const closeDialog = () => {
    setApprovedDialogOpen(false);
  };

  const sortedSubcategories = [...subcategories]
    .map((subcategory) => ({
      ...subcategory,
      categoryName:
        categories.find((cat) => cat.id === subcategory.categoryId)?.name ||
        "Unassigned",
    }))
    .sort((a, b) => {
      const keyA = a[sortConfig.key] || "";
      const keyB = b[sortConfig.key] || "";
      if (keyA < keyB) return sortConfig.direction === "ascending" ? -1 : 1;
      if (keyA > keyB) return sortConfig.direction === "ascending" ? 1 : -1;
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

  const handleRowDoubleClick = (subcategory) => {
    setSelectedSubcategory({ ...subcategory });
    setEditMode(true);
  };

  const handleSave = async () => {
    try {
      const updatedSubcategory = { ...selectedSubcategory };
      await axios.put(
        `http://localhost:5196/api/Subcategory/${selectedSubcategory.id}`,
        updatedSubcategory
      );
      setSubcategories((prevSubcategories) =>
        prevSubcategories.map((subcategory) =>
          subcategory.id === selectedSubcategory.id
            ? updatedSubcategory
            : subcategory
        )
      );
      setMessage("Update");
      openDialog();
      setEditMode(false);
      setSelectedSubcategory({
        id: "",
        name: "",
        categoryName: "",
        description: "",
        isActive: true,
      });
      fetchSubcategories();
      fetchCategories();
    } catch (error) {
      console.error("Error updating subcategory:", error);
    }
  };

  const indexOfLastData = currentPage * dataPerPage;
  const indexOfFirstData = indexOfLastData - dataPerPage;
  const currentData = sortedSubcategories.slice(
    indexOfFirstData,
    indexOfLastData
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleCancel = () => {
    setAddMode(false);
    setEditMode(false);
    setSelectedSubcategory(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (editMode) {
      setSelectedSubcategory((prevSubcategory) => ({
        ...prevSubcategory,
        [name]: name === "isActive" ? value === "Active" : value,
      }));
    } else if (addMode) {
      setNewSubCategory((prevSubCategory) => ({
        ...prevSubCategory,
        [name]: value,
      }));
    }
  };

  const handleAddSubCategory = async () => {
    try {
      await axios.post("http://localhost:5196/api/SubCategory", {
        name: newSubCategory.name,
        description: newSubCategory.description,
        categoryId: newSubCategory.categoryId,
      });
      setNewSubCategory("");
      setMessage("Insert");
      openDialog();     
      setAddMode(false);
      fetchSubcategories();
      fetchCategories();
    } catch (error) {
      console.error("Error inserting subcategory:", error);
    }
  };

  return (
    <div className="management-container">
      <h1>SubCategory Management</h1>
      {/* Render the table and pagination only when not in edit or add mode */}
      {!editMode && !addMode ? (
        <>
          <button
            className="add-management-button"
            onClick={() => {
              setNewSubCategory("");
              setMessage("");
              setAddMode(true);
            }}
          >
            Add SubCategory
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
                <th onClick={() => requestSort("categoryName")}>
                  Category {getSortIcon("categoryName")}
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
              {currentData.map((subcategory) => (
                <tr
                  key={subcategory.id}
                  onDoubleClick={() => handleRowDoubleClick(subcategory)}
                >
                  <td>{subcategory.id}</td>
                  <td>{subcategory.name}</td>
                  <td>{subcategory.categoryName}</td>
                  <td>{subcategory.description}</td>
                  <td
                    style={{
                      color: subcategory.isActive ? "green" : "red",
                      fontWeight: "bold",
                    }}
                  >
                    {subcategory.isActive ? "Active" : "Inactive"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination controls only visible when in table mode */}
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
              {Math.ceil(subcategories.length / dataPerPage)}
            </span>
            <button
              className="pagination-button"
              onClick={() => paginate(currentPage + 1)}
              disabled={
                currentPage === Math.ceil(subcategories.length / dataPerPage)
              }
            >
              Next
            </button>
          </div>
        </>
      ) : editMode ? (
        <div className="adminsidemanage-edit-form">
          <h3 className="admin-sidemanager-edit-form-title">
            Edit Subcategory
          </h3>
          <form className="admin-sidemanager-edit-form">
            <div className="adminside-edit-form-group ">
              <label className="ad-label">Name:</label>
              <input
                className="adminside-input-fieldd"
                type="text"
                name="name"
                value={selectedSubcategory.name}
                onChange={handleChange}
              />
            </div>

            <div className="adminside-edit-form-group ">
              <label className="ad-label">Category:</label>
              <select
                className="adminside-input-fieldd"
                name="categoryId"
                value={selectedSubcategory.categoryId || ""}
                onChange={handleChange}
              >
                <option value="">Select Category</option>
                {categories.map((category) =>
                  category.isActive ? (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ) : null
                )}
              </select>
            </div>

            <div className="adminside-edit-form-group ">
              <label className="ad-label">Description:</label>
              <textarea
                className="adminside-input-fieldd"
                name="description"
                value={selectedSubcategory.description || ""}
                onChange={handleChange}
              />
            </div>

            <div className="adminside-edit-form-group ">
              <label className="ad-label">Status:</label>
              <select
                className="admin-sidemanager-fieldd"
                name="isActive"
                value={selectedSubcategory.isActive ? "Active" : "Inactive"}
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
          <h1 className="admin-sidemanager-edit-form-title">
            Add New SubCategory
          </h1>
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="adminside-edit-form-group">
              <label htmlFor="name" className="ad-label">
                Name:
              </label>
              <input
                type="text"
                name="name"
                placeholder="Enter new sub-category name"
                value={newSubCategory.name}
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
                value={newSubCategory.description}
                onChange={handleChange}
                className="adminside-input-fieldd"
              />
            </div>

            <div className="adminside-edit-form-group">
              <label htmlFor="categoryId" className="ad-label">
                Category:
              </label>
              <select
                name="categoryId"
                value={newSubCategory.categoryId}
                onChange={handleChange}
                className="adminside-input-fieldd"
              >
                <option value="">Select Category</option>
                {categories.map((category) =>
                  category.isActive ? (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ) : null
                )}
              </select>
            </div>

            <div className="adminside-button-section">
              <button
                className="adminside-btn-primary"
                onClick={handleAddSubCategory}
              >
                Add
              </button>
              <button
                className="adminside-btn-secondary"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
            {message && (
              <p
                className={`message ${
                  message.includes("success") ? "success" : "error"
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

export default SubcategoryManagement;

import axios from "axios";
import React, { useState, useEffect } from "react";
import "./InsertSubCategory.css";

const InsertSubCategory = ({ onClose, onCategoryAdded }) => {
    const [newSubCategory, setNewSubCategory] = useState({
        name: "",
        description: "",
        categoryId: "",
    });
    const [categories, setCategories] = useState([]);
    const [message, setMessage] = useState("");
    const [showInsert, setShowInsert] = useState(true); // State to control dialog visibility


    useEffect(() => {
        fetchCategories();
    }, []);

    // Fetch active categories from API
    const fetchCategories = async () => {
        try {
            const response = await axios.get("http://localhost:5196/api/Category");
            setCategories(response.data);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    // Handle input changes
    const handleInputChange = (e) => {
        setNewSubCategory({ ...newSubCategory, [e.target.name]: e.target.value });
    };

    const handleCloseDialog = () => {
        setShowInsert(false);
        if (onClose) onClose(); // Close the dialog by calling onClose if it's passed as a prop
    };

    // Handle request submission
    const handleSubmitRequest = async () => {
        const data = {
            businessId: localStorage.getItem("businessId"),
            name: newSubCategory.name,
            description: newSubCategory.description,
            categoryId: newSubCategory.categoryId,
            adminComments: "Pending approval", // Default admin comments
        };

        try {
            await axios.post("http://localhost:5196/api/SubCategoryRequest/submit", data);
            setNewSubCategory({ businessId: "", name: "", description: "", categoryId: "" });
            setMessage("Your request has been submitted. Please wait for admin approval.");
            alert("Request successfully submitted! Wait for admin approval.");
            onCategoryAdded(); // Refresh categories
            onClose(); // Close the modal
            setShowInsert(false);
        } catch (error) {
            console.error("Error submitting request:", error);
            setMessage("Error submitting your request. Please try again.");
        }
    };
    if (!showInsert) return null; // Return null if the dialog should be hidden

    return (
        <div className="container">
            <h1>Submit Request for New SubCategory</h1>
            <form className="subcategory-form" onSubmit={(e) => e.preventDefault()}>
                <label>Name:</label>
                <input
                    type="text"
                    name="name"
                    style={{width:'90%'}}
                    value={newSubCategory.name}
                    onChange={handleInputChange}
                    placeholder="Enter subcategory name"
                />

                <label>Description:</label>
                <textarea
                    name="description"
                    style={{width:'90%'}}
                    value={newSubCategory.description}
                    onChange={handleInputChange}
                    placeholder="Enter subcategory description"
                />

                <label>Category:</label>
                <select
                    name="categoryId"
                    style={{width:'90%'}}
                    value={newSubCategory.categoryId}
                    onChange={(e) => {
                        if (e.target.value === "add") {
                            // Handle adding new category if needed
                        } else {
                            handleInputChange(e);
                        }
                    }}
                >
                    <option value="">Select Category</option>
                    {categories.map((category) =>
                        category.isActive ? (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ) : null
                    )}
                    <option value="add">+ Add New Category</option>
                </select>
                <div className="button-container">
                    <button onClick={handleSubmitRequest} className="insert-btn">
                        Submit Request
                    </button>
                    <button type="button" onClick={handleCloseDialog} className="cancel-btn">Cancel</button>
                </div>

                {message && (
                    <p className={`message ${message.includes("successfully") ? "success" : "error"}`}>
                        {message}
                    </p>
                )}
            </form>
        </div>
    );
};

export default InsertSubCategory;

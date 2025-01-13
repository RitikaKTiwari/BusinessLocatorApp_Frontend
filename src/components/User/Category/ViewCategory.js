import React, { useState, useEffect } from "react";
import axios from "axios";
import InsertCategory from "./InsertCategory"; // Import your InsertCategory component
import './ViewCategory.css';

const ViewCategory = () => {
    const [categories, setCategories] = useState([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    useEffect(() => {
        fetchCategories();
    }, [categories]);

    const fetchCategories = async () => {
        try {
            const response = await axios.get("http://localhost:5196/api/Category");
            setCategories(response.data);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    const openDialog = () => {
        setIsDialogOpen(true);
    };

    const closeDialog = () => {
        setIsDialogOpen(false);
    };

    return (
        <div className="category-container">
            <h1 className='h1forcat'>Category Management</h1>

            {/* Add Category button */}
            <button onClick={openDialog} className="new-category-btn">
                Add Category
            </button>

            <div className="category-grid">
                {categories.map((category) => (
                    <div key={category.id} className="category-card">
                        <h3 className="category-name">{category.name}</h3>
                    </div>
                ))}
            </div>

            {/* Dialog with InsertCategory component */}
            {isDialogOpen && (
  <>
    <div className="overlay" onClick={closeDialog}></div>
    <InsertCategory
      onClose={closeDialog}           // Close dialog when requested
      onCategoryAdded={fetchCategories} // Refresh categories after adding
    />
  </>
)}

        </div>
    );
};

export default ViewCategory;

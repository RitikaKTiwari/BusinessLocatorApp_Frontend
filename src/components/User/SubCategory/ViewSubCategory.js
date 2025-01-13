import React, { useState, useEffect } from "react";
import axios from "axios";
import InsertSubCategory from "../SubCategory/InsertSubCategory"; // Import InsertSubCategory
import '../SubCategory/ViewSubCategory.css';

const ViewSubCategory = () => {
    const [subcategories, setSubCategories] = useState([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    useEffect(() => {
        fetchCategories();
    }, [subcategories]);

    const fetchCategories = async () => {
        try {
            const response = await axios.get("http://localhost:5196/api/SubCategory");
            setSubCategories(response.data);
        } catch (error) {
            console.error("Error fetching subcategories:", error);
        }
    };

    const openDialog = () => {
        setIsDialogOpen(true); // Open dialog
    };

    const closeDialog = () => {
        setIsDialogOpen(false); // Close dialog
    };

    return (
        <div>
            <h1 className="subcategory-container-h1">Subcategory Management</h1>
            <div className="technician-con">
                <button onClick={openDialog} className="insert-subcategory-btn">
                    Add SubCategory
                </button>
                {subcategories.map((subcategory) => (
                <div key={subcategory.id} className="technician-card">
                    <div className="technician-header">
                            <p><strong className='tech-strong'>Name:</strong> {subcategory.name}</p>
                            <p><strong className='tech-strong'>Description:</strong> {subcategory.description}</p>
                            <p><strong className='tech-strong'>Category:</strong> {subcategory.categoryName}</p>
                            </div>
                    </div>
                    ))}

                { isDialogOpen && (
                        <div className="overlay" onClick={closeDialog}>
                            <div className="dialog-content" onClick={(e) => e.stopPropagation()}>
                                <InsertSubCategory onClose={closeDialog} onCategoryAdded={fetchCategories} />
                            </div>
                        </div>
                    )}
            </div>
        </div>
    );
};

export default ViewSubCategory;

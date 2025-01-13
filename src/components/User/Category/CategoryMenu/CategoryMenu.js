import React, { useEffect, useState } from "react";
import axios from "axios";
import { ScrollMenu } from "react-horizontal-scrolling-menu";
import "react-horizontal-scrolling-menu/dist/styles.css";
import "./CategoryMenu.css";
import { useNavigate } from "react-router-dom";

const MenuItem = ({ text, onClick, selected }) => {
    return (
        <div
            className={`cmmenu-item ${selected ? 'selected' : ''}`}
            onClick={onClick}
        >
            <span>{text}</span>
        </div>
    );
};

const CategoryMenu = () => {
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [services, setServices] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const navigate=useNavigate();

    // Fetch categories from the API
    const fetchCategories = async () => {
        try {
            const response = await axios.get("http://localhost:5196/api/Category");
            setCategories(response.data);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    const fetchSubcategoriesAndServices = async (categoryId) => {
        try {
            // Clear the previous subcategories and services
            setSubcategories([]);
            setServices([]);

            // Fetch subcategories based on categoryId
            const subcategoryResponse = await axios.get(`http://localhost:5196/api/SubCategory/ByCategoryId?id=${categoryId}`);
            const fetchedSubcategories = subcategoryResponse.data;
            setSubcategories(fetchedSubcategories);

            // Fetch services for each subcategory with error handling
            const servicesPromises = fetchedSubcategories.map(subcat =>
                axios.get(`http://localhost:5196/api/Service/BySubCategoryId?subcategoryid=${subcat.id}`)
                    .catch(error => {
                        console.error(`Error fetching services for subcategory ${subcat.id}:`, error);
                        return { data: [] }; // Fallback to empty array if the request fails
                    })
            );

            // Wait for all service requests to complete
            const servicesResponses = await Promise.all(servicesPromises);

            // Combine all services into a single array, handle undefined responses
            const allServices = servicesResponses.flatMap(response => response?.data || []);
            setServices(allServices);

        } catch (error) {
            console.error("Error fetching subcategories or services:", error);
        }
    };


    // Handle category click
    const handleCategoryClick = (category) => {
        if (selectedCategory && selectedCategory.id === category.id) {
            // If the same category is clicked again, deselect it (toggle off)
            setSelectedCategory(null);
            setSubcategories([]);
            setServices([]);
        } else {
            // Otherwise, select the new category and fetch data
            setSelectedCategory(category);
            fetchSubcategoriesAndServices(category.id);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    return (
        <div className="cmmaincatmenu">
            <div className="cmcategory-menu">
                <div className="cmscroll-menu-wrapper">
                    <ScrollMenu>
                        {categories.map((category) => (
                            <MenuItem
                                key={category.id}
                                text={category.name}
                                onClick={() => handleCategoryClick(category)}
                                selected={selectedCategory && selectedCategory.id === category.id}
                            />
                        ))}
                    </ScrollMenu>
                </div>
            </div>

            {selectedCategory && (
                <div className="cmsubcategory-menu">
                    {/* <div className="subcategory-title">
                        <h3>Subcategories and Services of {selectedCategory.name}</h3>
                    </div> */}
                    <div className="cmsubcategory-list">
                        {subcategories.length > 0 ? (
                            <>
                                {subcategories.map((subcat) => (
                                    <div key={subcat.id} className="cmsubcategory-item">
                                        <strong>{subcat.name}</strong>

                                        {/* Display services for this subcategory */}
                                        <div className="cmservices-list">
                                            {
                                                services.filter(service => service.subCategoryId === subcat.id).length > 0 ? (
                                                    services.filter(service => service.subCategoryId === subcat.id)
                                                        .map(service => (
                                                            <div key={service.id} className="cmservice-item" onClick={()=>{navigate(`/ViewFromMenu/${service.id}`)}}>
                                                                {service.name}
                                                            </div>
                                                        )
                                                        ))
                                                    : (
                                                        <div className="cmservice-item">No services available.</div>
                                                    )}
                                        </div>
                                    </div>
                                ))}
                            </>
                        ) : (
                            <p className="cmsubcategory-item">No subcategories available.</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CategoryMenu;
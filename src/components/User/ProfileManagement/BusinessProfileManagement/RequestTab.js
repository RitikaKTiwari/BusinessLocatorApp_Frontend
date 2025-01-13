import React, { useState, useEffect } from "react";
import axios from "axios";
import "./RequestTab.css";

const RequestTab = ({ businessId }) => {
    const [filter, setFilter] = useState("Category");
    const [requests, setRequests] = useState([]);
    const [error, setError] = useState(null);

    const fetchRequests = async () => {
        try {
            const url =
                filter === "Category"
                    ? `http://localhost:5196/api/CategoryRequest/Business/${businessId}`
                    : filter === "SubCategory" ? `http://localhost:5196/api/SubCategoryRequest/Business/${businessId}`
                        : `http://localhost:5196/api/ServiceRequest/Business/${businessId}`;
            const response = await axios.get(url);
            setRequests(response.data);
        } catch (error) {
            setRequests([]);
            setError("Failed to fetch requests.");
        }
    };

    useEffect(() => {
        fetchRequests();
    }, [filter, businessId]);

    return (
        <div className="requests-tab">
            <div className="filter-section">
                <label htmlFor="filter">Filter By:</label>
                <select
                    id="filter"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="filter-dropdown"
                >
                    <option value="Category">Category</option>
                    <option value="SubCategory">SubCategory</option>
                    <option value="Service">Service</option>
                </select>
            </div>
            <div className="requests-list">
                {error && <p className="error-message">{error}</p>}
                {requests.length > 0 ? (
                    <table className="requests-table">
                        <thead>
                            <tr>
                                {filter === "Category" ? (
                                    <>
                                        <th>Name</th>
                                        <th>Status</th>
                                        <th>AdminComments</th>
                                        <th>Updated At</th>
                                    </>
                                )
                                    : filter === "SubCategory" ? (
                                        <>
                                            <th>Name</th>
                                            <th>Category Name</th>
                                            <th>Status</th>
                                            <th>AdminComments</th>
                                            <th>Updated At</th>
                                        </>
                                    ) : (
                                        <>
                                            <th>Name</th>
                                            <th>SubCategory Name</th>
                                            <th>Status</th>
                                            <th>AdminComments</th>
                                            <th>Updated At</th>
                                        </>
                                    )}
                            </tr>
                        </thead>
                        <tbody>
                            {requests.map((request, index) => (
                                <tr key={index}>
                                    <td>{request.name}</td>
                                    {filter === "SubCategory" && request.category && request.category.name && (
                                        <td>{request.category.name}</td>
                                    )}
                                    {filter === "Service" && request.subCategory && request.subCategory.name && (
                                        <td>{request.subCategory.name}</td>
                                    )}
                                    <td>
                                        <span className={
                                            request.status === 'Approved' ? 'approved' :
                                                request.status === 'Rejected' ? 'rejected' :
                                                    'pending'
                                        }>
                                            {request.status}
                                        </span>
                                    </td>
                                    <td>{request.adminComments}</td>
                                    <td>{new Date(request.updatedAt).toLocaleString()}</td>
                                </tr>
                            ))}

                        </tbody>
                    </table>
                ) : (
                    <p>No requests available.</p>
                )}
            </div>
        </div>
    );
};

export default RequestTab;

import React, { useEffect, useState } from "react";
import axios from "axios";
import "./PendingNotification.css";

const PendingNotification = () => {
    const [businessRequests, setBusinessRequests] = useState([]);
    const [categoryRequests, setCategoryRequests] = useState([]);
    const [subCategorRequests, setSubCategoryRequests] = useState([]);
    const [serviceRequests, setServiceRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [adminComments, setAdminComments] = useState({});

    useEffect(() => {
        const fetchBusinessRequests = async () => {
            try {
                const response = await axios.get("http://localhost:5196/api/BusinessRequest/Pending", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                setBusinessRequests(response.data);
            } catch (error) {
                console.error("Error fetching business requests:", error);
            } finally {
                setLoading(false);
            }
        };

        const fetchCategoryRequests = async () => {
            try {
                const response = await axios.get('http://localhost:5196/api/CategoryRequest/Pending', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    }
                });
                setCategoryRequests(response.data);
            } catch (error) {
                console.error("Error fetching category request:", error);
            } finally {
                setLoading(false);
            }
        };

        const fetchSubCategoryRequests = async () => {
            try {
                const response = await axios.get('http://localhost:5196/api/SubCategoryRequest/Pending', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    }
                });
                setSubCategoryRequests(response.data);
            } catch (error) {
                console.error("Error fetching subcategory request:", error);
            } finally {
                setLoading(false);
            }
        };

        const fetchServiceRequests = async () => {
            try {
                const response = await axios.get('http://localhost:5196/api/ServiceRequest/Pending', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    }
                });
                setServiceRequests(response.data);
            } catch (error) {
                console.error("Error fetching service request:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBusinessRequests();
        fetchCategoryRequests();
        fetchSubCategoryRequests();
        fetchServiceRequests();
    }, []);


    const handleApproveRejectforBusiness = async (requestId, status) => {
        const comment =
            status === "Approved"
                ? "Business is now active"
                : adminComments[requestId] || "";

        if (status === "Rejected" && !comment) {
            alert("Please provide a comment when rejecting");
            return;
        }
        try {
            const response = await axios.post(
                "http://localhost:5196/api/BusinessRequest/approve-or-reject",
                {
                    id: requestId,
                    status: status,
                    adminComments: comment,
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            if (response.status === 200) {
                alert(`Request ${status} successfully`);
                setBusinessRequests((prev) =>
                    prev.filter((req) => req.id !== requestId)
                );
            }
        } catch (error) {
            console.error("Error updating request:", error);
            alert("Error updating request");
        }
    };

    const handleApproveRejectforCategory = async (requestId, status) => {
        const comment =
            status === "Approved"
                ? "Category is now active"
                : adminComments[requestId] || "";

        if (status === "Rejected" && !comment) {
            alert("Please provide a comment when rejecting");
            return;
        }
        try {
            const response = await axios.post(
                "http://localhost:5196/api/CategoryRequest/approve-reject",
                {
                    id: requestId,
                    status: status,
                    adminComments: comment,
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            if (response.status === 200) {
                alert(`Request ${status} successfully`);
                setCategoryRequests((prev) =>
                    prev.filter((req) => req.id !== requestId)
                );
            }
        } catch (error) {
            console.error("Error updating request:", error);
            alert("Error updating request");
        }
    };

    const handleApproveRejectforSubCategory = async (requestId, status) => {
        const comment =
            status === "Approved"
                ? "SubCategory is now active"
                : adminComments[requestId] || "";

        if (status === "Rejected" && !comment) {
            alert("Please provide a comment when rejecting");
            return;
        }
        try {
            const response = await axios.post(
                "http://localhost:5196/api/SubCategoryRequest/approve-reject",
                {
                    id: requestId,
                    status: status,
                    adminComments: comment,
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            if (response.status === 200) {
                alert(`Request ${status} successfully`);
                setSubCategoryRequests((prev) =>
                    prev.filter((req) => req.id !== requestId)
                );
            }
        } catch (error) {
            console.error("Error updating request:", error);
            alert("Error updating request");
        }
    };

    const handleApproveRejectforService = async (requestId, status) => {
        const comment =
            status === "Approved"
                ? "Service is now active"
                : adminComments[requestId] || "";

        if (status === "Rejected" && !comment) {
            alert("Please provide a comment when rejecting");
            return;
        }
        try {
            const response = await axios.post(
                "http://localhost:5196/api/ServiceRequest/approve-reject",
                {
                    id: requestId,
                    status: status,
                    adminComments: comment,
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            if (response.status === 200) {
                alert(`Request ${status} successfully`);
                setServiceRequests((prev) =>
                    prev.filter((req) => req.id !== requestId)
                );
            }
        } catch (error) {
            console.error("Error updating request:", error);
            alert("Error updating request");
        }
    };

    const handleCommentChange = (id, comment) => {
        setAdminComments((prev) => ({ ...prev, [id]: comment }));
    };

    if (loading) {
        return (
            <div className="loading-spinner">
                <span>Loading...</span>
            </div>
        );
    }

    return (
        <div className="pending-notifications">
            <h1>Notifications</h1>

            {businessRequests.length === 0 ? (
                null
            ) : (
                <div className="pending-card-container">
                    {businessRequests.map((request) => (
                        <div className="pending-card" key={request.id}>
                            <h3>Business Approval</h3>
                            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                <strong>Name: {request.name}</strong>
                                <strong>Email: {request.email}</strong>
                                <strong>Description: {request.description}</strong>
                                <strong>Contact No: {request.contactNo}</strong>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                <p>
                                    <textarea
                                        placeholder="Add comments (required if rejecting)"
                                        style={{ width: '350px' }}
                                        value={adminComments[request.id] || ""}
                                        onChange={(e) =>
                                            handleCommentChange(request.id, e.target.value)
                                        }
                                    ></textarea>
                                </p>
                                <div className="pending-button-group">
                                    <button
                                        className="pending-approve-button"
                                        onClick={() =>
                                            handleApproveRejectforBusiness(request.id, "Approved")
                                        }
                                    >
                                        Approve
                                    </button>
                                    <button
                                        className="pending-reject-button"
                                        onClick={() => handleApproveRejectforBusiness(request.id, "Rejected")}
                                    >
                                        Reject
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}


            {categoryRequests.length === 0 ? (
                null
            ) : (
                <div className="pending-card-container">
                    {categoryRequests.map((request) => (
                        <div className="pending-card" key={request.id}>
                            <h3>Category Approval</h3>
                            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                <strong><b>Category : {request.name}</b></strong>
                                <strong>Business : {request.business.name}</strong>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                <p>
                                    <textarea
                                        placeholder="Add comments (required if rejecting)"
                                        style={{ width: '350px' }}
                                        value={adminComments[request.id] || ""}
                                        onChange={(e) =>
                                            handleCommentChange(request.id, e.target.value)
                                        }
                                    ></textarea>
                                </p>
                                <div className="pending-button-group">
                                    <button
                                        className="pending-approve-button"
                                        onClick={() =>
                                            handleApproveRejectforCategory(request.id, "Approved")
                                        }
                                    >
                                        Approve
                                    </button>
                                    <button
                                        className="pending-reject-button"
                                        onClick={() => handleApproveRejectforCategory(request.id, "Rejected")}
                                    >
                                        Reject
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}


            {subCategorRequests.length === 0 ? (
                null
            ) : (
                <div className="pending-card-container">
                    {subCategorRequests.map((request) => (
                        <div className="pending-card" key={request.id}>
                            <h3>SubCategory Approval</h3>
                            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                <strong>SubCategory:{request.name}</strong>
                                <strong>Description:{request.description}</strong>
                                <strong>Category: {request.category.name}</strong>
                                <strong>Business: {request.business.name}</strong>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                <p>
                                    <textarea
                                        placeholder="Add comments (required if rejecting)"
                                        style={{ width: '350px' }}
                                        value={adminComments[request.id] || ""}
                                        onChange={(e) =>
                                            handleCommentChange(request.id, e.target.value)
                                        }
                                    ></textarea>
                                </p>
                                <div className="pending-button-group">
                                    <button
                                        className="pending-approve-button"
                                        onClick={() =>
                                            handleApproveRejectforSubCategory(request.id, "Approved")
                                        }
                                    >
                                        Approve
                                    </button>
                                    <button
                                        className="pending-reject-button"
                                        onClick={() => handleApproveRejectforSubCategory(request.id, "Rejected")}
                                    >
                                        Reject
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )
            }

            {
                serviceRequests.length === 0 ? (
                    null
                ) : (
                    <div className="pending-card-container">
                        {serviceRequests.map((request) => (
                            <div className="pending-card" key={request.id}>
                                <h3>Service Approval</h3>
                                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <strong>Service:{request.name}</strong>
                                    <strong>Description:{request.description}</strong>
                                    <strong>SubCategory: {request.subCategory.name}</strong>
                                    <strong>Business: {request.business.name}</strong>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <p>
                                        <textarea
                                            placeholder="Add comments (required if rejecting)"
                                            style={{ width: '350px' }}
                                            value={adminComments[request.id] || ""}
                                            onChange={(e) =>
                                                handleCommentChange(request.id, e.target.value)
                                            }
                                        ></textarea>
                                    </p>
                                    <div className="pending-button-group">
                                        <button
                                            className="pending-approve-button"
                                            onClick={() =>
                                                handleApproveRejectforService(request.id, "Approved")
                                            }
                                        >
                                            Approve
                                        </button>
                                        <button
                                            className="pending-reject-button"
                                            onClick={() => handleApproveRejectforService(request.id, "Rejected")}
                                        >
                                            Reject
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )
            }

            {
                businessRequests.length === 0 && categoryRequests.length === 0 && subCategorRequests.length === 0 && serviceRequests.length === 0 ?
                    (
                        <p>No pending requests found</p>
                    ) : null
            }
        </div >
    );
};

export default PendingNotification;

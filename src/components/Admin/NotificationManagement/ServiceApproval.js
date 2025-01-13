import React, { useEffect, useState } from "react";
import axios from "axios";
import ApprovedDialogComponent from '../../User/DialogComponent/ApprovedDialogComponent';
import "./Approval.css";

const ServiceApproval = () => {
  const [serviceRequests, setServiceRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [statusUpdates, setStatusUpdates] = useState({});
  const [adminComments, setAdminComments] = useState({});
  const [filter, setFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1); // Current page
  const [requestsPerPage] = useState(5); // Requests per page
  const [approvedDialogOpen, setApprovedDialogOpen] = useState(false);
  const [message, setMessage] = useState({});

  const fetchServiceRequests = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5196/api/ServiceRequest"
      );
      setServiceRequests(response.data);
      setFilteredRequests(response.data);
    } catch (error) {
      console.error("Error fetching service requests:", error);
    }
  };

  const openDialog = () => {
    setApprovedDialogOpen(true);
  };

  const closeDialog = () => {
    setApprovedDialogOpen(false);
  };

  useEffect(() => {
    fetchServiceRequests();
  }, []);

  // Pagination logic
  const indexOfLastRequest = currentPage * requestsPerPage;
  const indexOfFirstRequest = indexOfLastRequest - requestsPerPage;
  const currentRequests = filteredRequests.slice(
    indexOfFirstRequest,
    indexOfLastRequest
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleStatusChange = (requestId, status) => {
    setStatusUpdates((prev) => ({
      ...prev,
      [requestId]: status,
    }));

    if (status === "Approved") {
      setAdminComments((prev) => ({
        ...prev,
        [requestId]: "",
      }));
    }
  };

  const handleCommentChange = (requestId, comment) => {
    setAdminComments((prev) => ({
      ...prev,
      [requestId]: comment,
    }));
  };

  const handleApproveReject = async (requestId) => {
    const status = statusUpdates[requestId];
    let comments = adminComments[requestId] || "";

    if (!status) {
      alert("Please select a status (Approve or Reject)");
      return;
    }

    if (status === "Rejected" && !comments) {
      alert("Please provide a comment when rejecting");
      return;
    }

    if (status === "Approved") {
      comments = "Service is now active.";
    }

    try {
      const response = await axios.post(
        "http://localhost:5196/api/ServiceRequest/approve-reject",
        {
          id: requestId,
          status: status,
          adminComments: comments,
        }
      );

      if (response.status === 200) {
        // alert(`Request ${status} successfully`);
        if (status === "Approved") {
          setMessage("Approve")
        }
        else {
          setMessage("Reject")
        }
        openDialog();
        fetchServiceRequests(); // Refresh data after update
      }
    } catch (error) {
      console.error("Error updating service request:", error);
      alert("Error updating service request");
    }
  };

  const handleFilterChange = (e) => {
    const selectedFilter = e.target.value;
    setFilter(selectedFilter);
    applyFilter(selectedFilter);
  };

  const applyFilter = (selectedFilter) => {
    if (selectedFilter === "All") {
      setFilteredRequests(serviceRequests);
    } else {
      setFilteredRequests(
        serviceRequests.filter((req) => req.status === selectedFilter)
      );
    }
    setCurrentPage(1); // Reset to the first page when filter changes
  };

  return (
    <div className="approval-list-container">
      <h1>Service Approval Management</h1>
      <div className="filter-container">
        <label>Filters:</label>
        <select
          className="filter-dropdown"
          value={filter}
          onChange={handleFilterChange}
        >
          <option value="All">All</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>
      <table className="approval-table">
        <thead>
          <tr>
            <th>Request ID</th>
            <th>Business Name</th>
            <th>Service Name</th>
            <th>Description</th>
            <th>SubCategory Name</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {currentRequests.length > 0 ? (
            currentRequests.map((request) => (
              <tr key={request.id}>
                <td>{request.id}</td>
                <td>{request.business.name}</td>
                <td>{request.name}</td>
                <td>{request.description}</td>
                <td>{request.subCategory.name}</td>
                <td>
                  <span
                    className={
                      request.status === "Approved"
                        ? "approved"
                        : request.status === "Rejected"
                        ? "rejected"
                        : "pending"
                    }
                  >
                    {request.status}
                  </span>
                </td>
                <td className="action-cell">
                  <select
                    className="status-dropdown"
                    value={statusUpdates[request.id] || request.status}
                    onChange={(e) =>
                      handleStatusChange(request.id, e.target.value)
                    }
                    disabled={
                      request.status !== "Pending" &&
                      request.status !== "Rejected"
                    }
                  >
                    <option value="Pending">Select Status</option>
                    <option value="Approved">Approve</option>
                    <option value="Rejected">Reject</option>
                  </select>

                  {statusUpdates[request.id] === "Rejected" && (
                    <textarea
                      value={adminComments[request.id] || ""}
                      onChange={(e) =>
                        handleCommentChange(request.id, e.target.value)
                      }
                      placeholder="Provide comments"
                      rows="4"
                    />
                  )}

                  <button
                    onClick={() => handleApproveReject(request.id)}
                    className="approve-reject-button"
                    disabled={
                      request.status !== "Pending" &&
                      request.status !== "Rejected"
                    }
                  >
                    Submit
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7">No service requests available</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination Controls */}
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
          {Math.ceil(filteredRequests.length / requestsPerPage)}
        </span>
        <button
          className="pagination-button"
          onClick={() => paginate(currentPage + 1)}
          disabled={
            currentPage === Math.ceil(filteredRequests.length / requestsPerPage)
          }
        >
          Next
        </button>
      </div>
      {approvedDialogOpen && <ApprovedDialogComponent onClose={closeDialog} message={message} />}
    </div>
  );
};

export default ServiceApproval;

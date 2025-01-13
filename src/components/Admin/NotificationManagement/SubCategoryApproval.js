import React, { useEffect, useState } from "react";
import axios from "axios";
import ApprovedDialogComponent from '../../User/DialogComponent/ApprovedDialogComponent';
import "./Approval.css";

const SubCategoryApproval = () => {
  const [subCategoryRequests, setSubCategoryRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [statusUpdates, setStatusUpdates] = useState({});
  const [adminComments, setAdminComments] = useState({});
  const [filter, setFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [approvedDialogOpen, setApprovedDialogOpen] = useState(false);
  const [message, setMessage] = useState({});

  const fetchSubCategoryRequests = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5196/api/SubCategoryRequest"
      ); // Replace with your API endpoint
      setSubCategoryRequests(response.data);
      setFilteredRequests(response.data); // Initialize with all requests
    } catch (error) {
      console.error("Error fetching subcategory requests:", error);
    }
  };

  const openDialog = () => {
    setApprovedDialogOpen(true);
  };

  const closeDialog = () => {
    setApprovedDialogOpen(false);
  };

  useEffect(() => {
    fetchSubCategoryRequests();
  }, []);

  // Handle filter change
  const handleFilterChange = (e) => {
    const selectedFilter = e.target.value;
    setFilter(selectedFilter);
    setCurrentPage(1); // Reset to first page when filter changes
    applyFilter(selectedFilter);
  };

  const applyFilter = (selectedFilter) => {
    if (selectedFilter === "All") {
      setFilteredRequests(subCategoryRequests);
    } else {
      const filtered = subCategoryRequests.filter(
        (req) => req.status === selectedFilter
      );
      setFilteredRequests(filtered);
    }
  };

  // Pagination logic
  const indexOfLastRequest = currentPage * itemsPerPage;
  const indexOfFirstRequest = indexOfLastRequest - itemsPerPage;
  const currentItems = filteredRequests.slice(
    indexOfFirstRequest,
    indexOfLastRequest
  );

  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage) || 1; // Ensure at least 1 page is shown

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handle status and comments changes
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
    const comments = adminComments[requestId] || "";

    if (!status) {
      alert("Please select a status (Approve or Reject)");
      return;
    }

    if (status === "Rejected" && !comments) {
      alert("Please provide a comment when rejecting");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5196/api/SubCategoryRequest/approve-reject",
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
        fetchSubCategoryRequests();
        setSubCategoryRequests((prevRequests) =>
          prevRequests.map((req) =>
            req.id === requestId ? { ...req, status: status } : req
          )
        );
        applyFilter(filter); // Reapply filter after update
      }
    } catch (error) {
      console.error("Error updating subcategory request:", error);
      alert("Error updating subcategory request");
    }
  };

  return (
    <div className="approval-list-container">
      <h1>SubCategory Approval Management</h1>
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
            <th>SubCategory Name</th>
            <th>Description</th>
            <th>Category Name</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.length > 0 ? (
            currentItems.map((request) => (
              <tr key={request.id}>
                <td>{request.id}</td>
                <td>{request.business.name}</td>
                <td>{request.name}</td>
                <td>{request.description}</td>
                <td>{request.category.name}</td>
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
              <td colSpan="7">No subcategory requests available</td>
            </tr>
          )}
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
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="pagination-button"
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
      {approvedDialogOpen && <ApprovedDialogComponent onClose={closeDialog} message={message} />}
    </div>
  );
};

export default SubCategoryApproval;

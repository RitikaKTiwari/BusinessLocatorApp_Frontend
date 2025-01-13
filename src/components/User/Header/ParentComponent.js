import React, { useState, useEffect } from "react";
import Header from "./Header";
import MapLayout from "./MapLayout";
import axios from "axios";

const ParentComponent = () => {
  const [businesses, setBusinesses] = useState([]); // All businesses
  const [filteredBusinesses, setFilteredBusinesses] = useState([]); // Businesses to display

  // Fetch all businesses on load
  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const response = await axios.get("http://localhost:5196/api/Businesses");
        setBusinesses(response.data);
        setFilteredBusinesses(response.data); // Show all businesses by default
      } catch (error) {
        console.error("Error fetching businesses:", error);
      }
    };

    fetchBusinesses();
  }, []);

  // Handle search results from Header
  const handleSearchResults = (results) => {
    setFilteredBusinesses(results.length > 0 ? results : businesses); // Reset to all if no results
  };

  return (
    <div>
      <Header onSearch={handleSearchResults} />
      <MapLayout filteredBusinesses={filteredBusinesses} />
    </div>
  );
};

export default ParentComponent;

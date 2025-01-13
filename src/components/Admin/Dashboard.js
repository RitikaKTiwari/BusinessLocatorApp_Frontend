import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Dashboard.css";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "./Dashboard.css";

// Register chart components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [totalActiveUsers, setTotalActiveUsers] = useState(null);
  const [totalActiveBusinesses, setTotalActiveBusinesses] = useState(null);
  const [totalActiveTechnicians, setTotalActiveTechnicians] = useState(null);
  const [totalActiveServices, setTotalActiveServices] = useState(null);

  const [topServices, setTopServices] = useState([]);
  const [topCustomers, setTopCustomers] = useState([]);
  const [topBusinesses, setTopBusinesses] = useState([]);
  const [businessPrices, setBusinessPrices] = useState([]);

  useEffect(() => {
    const fetchTotalActiveUsers = async () => {
      try {
        const response = await fetch(
          "http://localhost:5196/api/User/total-active-users",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const data = await response.json();
        setTotalActiveUsers(data.totalActiveUsers);
      } catch (error) {
        console.error("Error fetching total active users:", error);
      }
    };

    const fetchTotalActiveBusiness = async () => {
      try {
        const response = await fetch(
          "http://localhost:5196/api/Business/total-active-businesses",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const data = await response.json();
        setTotalActiveBusinesses(data.totalActiveBusinesses);
      } catch (err) {
        console.error("Error fetching total active businesses:", err);
      }
    };

    const fetchTotalActiveServices = async () => {
      try {
        const response = await fetch(
          "http://localhost:5196/api/Service/total-active-services",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const data = await response.json();
        setTotalActiveServices(data.totalActiveServices);
      } catch (err) {
        console.error("Error fetching total active services:", err);
      }
    };

    const fetchTotalActiveTechnicians = async () => {
      try {
        const response = await fetch(
          "http://localhost:5196/api/Technician/total-active-technicians",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const data = await response.json();
        setTotalActiveTechnicians(data.totalActiveTechnicians);
      } catch (err) {
        console.error("Error fetching total active technicians:", err);
      }
    };

    const fetchTopServices = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5196/api/Service/top-services?top=5",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setTopServices(response.data);
      } catch (error) {
        console.error("Error fetching top services:", error);
      }
    };

    const fetchTopCustomers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5196/api/User/top-customers",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setTopCustomers(response.data);
      } catch (error) {
        console.error("Error fetching top customers:", error);
      }
    };

    const fetchTopBusinesses = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5196/api/Business/top?top=5",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setTopBusinesses(response.data);
      } catch (error) {
        console.error("Error fetching top businesses:", error);
      }
    };

    const fetchBusinessPrices = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5196/api/Dashboard/BusinessEarningsComparison",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setBusinessPrices(response.data);
      } catch (error) {
        console.error("Error fetching business prices:", error);
      }
    };

    fetchTotalActiveUsers();
    fetchTotalActiveBusiness();
    fetchTotalActiveServices();
    fetchTotalActiveTechnicians();
    fetchTopServices();
    fetchTopCustomers();
    fetchTopBusinesses();
    fetchBusinessPrices();
  }, []);

  const chartData = {
    labels: businessPrices.map((bp) => bp.businessName),
    datasets: [
      {
        label: "Business Prices",
        data: businessPrices.map((bp) => bp.totalEarnings),
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    scales: {
      y: {
        min: 100, // Set a minimum value on the Y-axis
        max: 10000, // Set a maximum value on the Y-axis
      },
    },
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Price Trends for Businesses",
      },
    },
  };

  return (
    <div className="admindashboard">
      <div className="dashboard-main-container">
        <div className="dashboard-stats">
          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-users"></i>
            </div>
            <h2>Total Active Users</h2>
            <p>{totalActiveUsers !== null ? totalActiveUsers : "Loading..."}</p>
          </div>
          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-building"></i>
            </div>
            <h2>Total Businesses</h2>
            <p>
              {totalActiveBusinesses !== null
                ? totalActiveBusinesses
                : "Loading..."}
            </p>
          </div>
          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-concierge-bell"></i>
            </div>
            <h2>Total Services</h2>
            <p>
              {totalActiveServices !== null
                ? totalActiveServices
                : "Loading..."}
            </p>
          </div>
          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-tools"></i>
            </div>
            <h2>Total Technicians</h2>
            <p>
              {totalActiveTechnicians !== null
                ? totalActiveTechnicians
                : "Loading..."}
            </p>
          </div>
        </div>
      </div>

      {/* Sections for Customers, Services, and Businesses */}
      <div className="sections-container">
        <div className="section-container">
          <div className="top-customers-container">
            <h3>Top Customers</h3>
            <div className="customer-list-header">
              <span>#</span>
              <span>Name</span>
              <span>Email</span>
            </div>
            <div className="customer-list">
              {topCustomers.length > 0
                ? topCustomers.map((customer, index) => (
                    <div key={index} className="customer-item">
                      <span>{index + 1}</span>
                      <span>{customer.userName}</span>
                      <span>{customer.email}</span>
                    </div>
                  ))
                : "Loading..."}
            </div>
          </div>
        </div>

        <div className="admin-chart-section-container">
          <h3>Business Price Trends</h3>
          <div className="admin-chart-container">
            {businessPrices.length > 0 ? (
              <Line data={chartData} options={chartOptions} />
            ) : (
              "Loading chart..."
            )}
          </div>
        </div>

        <div className="section-container">
          <div className="top-services-container">
            <h3>Top Services</h3>
            <div className="service-list-header">
              <span>#</span>
              <span>Name</span>
              <span>Description</span>
            </div>
            <div className="service-list">
              {topServices.length > 0
                ? topServices.map((service, index) => (
                    <div key={index} className="service-item">
                      <span>{index + 1}</span>
                      <span>{service.name}</span>
                      <span>{service.description}</span>
                    </div>
                  ))
                : "Loading..."}
            </div>
          </div>
        </div>

        <div className="section-container">
          <div className="top-businesses-container">
            <h3>Top Businesses</h3>
            <div className="business-list-header">
              <span>#</span>
              <span>Name</span>
              <span>Email</span>
            </div>
            <div className="business-list">
              {topBusinesses.length > 0
                ? topBusinesses.map((business, index) => (
                    <div key={index} className="business-item">
                      <span>{index + 1}</span>
                      <span>{business.name}</span>
                      <span>{business.email}</span>
                    </div>
                  ))
                : "Loading..."}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

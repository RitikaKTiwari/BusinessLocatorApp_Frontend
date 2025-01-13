import React, { useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "./BusinessPie.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const BusinessPie = () => {
  const [serviceData, setServiceData] = useState([]);
  const businessId=localStorage.getItem('businessId');

  useEffect(() => {
    const fetchMostBookedServices = async () => {
      try {
        const response = await fetch(
          `http://localhost:5196/api/Dashboard/most-booked-services/${businessId}`
        );
        const data = await response.json();
        if (data && Array.isArray(data) && data.length > 0) {
          setServiceData(data);
        }
      } catch (error) {
        console.error("Error fetching most booked services:", error);
      }
    };

    fetchMostBookedServices();
  }, [businessId]);

  const chartData = {
    labels: serviceData.map((service) => service.serviceName),
    datasets: [
      {
        label: "Booked Count",
        data: serviceData.map((service) => service.bookedCount),
        backgroundColor: [
          "rgb(255, 124, 31)",
          "rgba(54, 162, 235, 0.6)",
          "rgb(255, 193, 36)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
          "rgba(255, 159, 64, 0.6)",
        ],
        borderColor: [
          "rgba(255, 140, 0, 0.79)",
          "rgba(54, 162, 235, 1)",
          "rgb(255, 188, 20)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
      },
      legend: {
        display: true,
        position: "bottom",
      },
    },
  };

  return (
    <>
      <h2>Most Booked Services</h2>
      <div className="chart-container">
        {serviceData.length > 0 ? (
          <Pie className="chart-pie" data={chartData} options={chartOptions} />
        ) : (
          <p>No data available</p>
        )}
      </div>
    </>
  );
};

export default BusinessPie;

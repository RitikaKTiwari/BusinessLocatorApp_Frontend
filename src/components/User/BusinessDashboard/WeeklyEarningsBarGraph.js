import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const WeeklyEarningsBarGraph = ({ businessId }) => {
  const [weeklyEarnings, setWeeklyEarnings] = useState([]);

  useEffect(() => {
    const fetchWeeklyEarnings = async () => {
      try {
        const response = await fetch(`http://localhost:5196/api/Dashboard/CurrentMonthWeeklyEarnings?businessId=${businessId}`);
        const data = await response.json();
        if (data && Array.isArray(data)) {
          setWeeklyEarnings(data);
        }
      } catch (error) {
        console.error('Error fetching weekly earnings:', error);
      }
    };

    fetchWeeklyEarnings();
  }, [businessId]);

  const chartData = {
    labels: weeklyEarnings.map((week) => `Week ${week.weekNumber}`), // X-axis labels
    datasets: [
      {
        label: 'Earnings (₹)',
        data: weeklyEarnings.map((week) => week.totalEarnings), // Bar values
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false, // Disables aspect ratio for custom sizing
    plugins: {
      title: {
        display: true,
        text: 'Weekly Earnings for Current Month',
      },
     
      legend: {
        display: true,
        position: 'top',
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Week',
        },
        grid: {
          display: false, // Remove grid lines on the X-axis
        },
      },
      y: {
        title: {
          display: true,
          text: 'Earnings (₹)',
        },
        grid: {
          display: false, // Remove grid lines on the X-axis
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div
      style={{
        width: '400px', // Set the desired width
        height: '500px', // Set the desired height
        margin: 'auto', // Center the graph on the page
      }}
    >
      <h2 style={{ textAlign: 'center' }}>Weekly Earnings</h2>
      {weeklyEarnings.length > 0 ? (
        <Bar data={chartData} options={chartOptions} />
      ) : (
        <p style={{ textAlign: 'center' }}>No earnings data available for the current month.</p>
      )}
    </div>
  );
};

export default WeeklyEarningsBarGraph;
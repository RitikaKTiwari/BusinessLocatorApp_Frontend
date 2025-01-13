import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BusinessBar = () => {
    const businessId = localStorage.getItem('businessId'); // Use the correct key as a string
    const [chartData, setChartData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!businessId) {
            setError('Business ID not found in localStorage.');
            setLoading(false);
            return;
        }

        const fetchWeeklyEarnings = async () => {
            try {
                // Replace with your API URL
                const response = await axios.get(
                    `http://localhost:5196/api/Dashboard/CurrentMonthWeeklyEarnings?businessId=${businessId}`
                );

                const data = response.data;

                // Handle cases where no data is available
                if (data.length === 0) {
                    setChartData({
                        labels: ['No Data Available'],
                        datasets: [
                            {
                                label: 'Total Earnings (₹)',
                                data: [0],
                                backgroundColor: 'rgba(192, 75, 75, 0.6)',
                                borderColor: 'rgba(192, 75, 75, 1)',
                                borderWidth: 1,
                            },
                        ],
                    });
                } else {
                    // Map API response to chart format
                    const weeks = data.map(item => `Week ${item.weekNumber}`);
                    const earnings = data.map(item => item.totalEarnings);

                    setChartData({
                        labels: weeks,
                        datasets: [
                            {
                                label: 'Total Earnings (₹)',
                                data: earnings,
                                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                                borderColor: 'rgba(75, 192, 192, 1)',
                                borderWidth: 1,
                                barThickness: 20, // Adjust this value to make the bars thinner
                            },
                        ],
                    });
                    
                }
            } catch (err) {
                setError('Failed to fetch weekly earnings data. Please try again later.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchWeeklyEarnings();
    }, [businessId]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div style={{ color: 'red' }}>{error}</div>;
    }

    return (
        <div style={{ width: '80%', margin: '0 auto' }}>
            <h2>Weekly Earnings for Current Month</h2>
            <Bar
                data={chartData}
                options={{
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                        title: {
                            display: true,
                            text: 'Weekly Earnings',
                        },
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                stepSize: 50, // Adjust for better visualization
                            },
                        },
                    },
                }}
            />
        </div>
    );
};

export default BusinessBar;

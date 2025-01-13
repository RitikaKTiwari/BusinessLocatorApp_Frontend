import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import './BusinessDashboard.css';
import BusinessPie from './BusinessPie';
import BusinessBar from './BusinessBar';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const BusinessDashboard = () => {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [totalActiveUsers, setTotalActiveUsers] = useState(0);
  const [totalActiveServices, setTotalActiveServices] = useState(0);
  const [totalActiveTechnicians, setTotalActiveTechnicians] = useState(0);
  const menuRef = useRef(null);
  const businessId = localStorage.getItem("businessId");

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    // const fetchTotalActiveUsers = async () => {
    //   try {
    //     const response = await fetch('http://localhost:5196/api/BusinessService/countServicesById/${businessId}');
    //     const data = await response.json();
    //     setTotalActiveUsers(data.totalActiveUsers);
    //   } catch (error) {
    //     console.error('Error fetching total active users:', error);
    //   }
    // };

    const fetchTotalActiveServices = async () => {
      try {
        const response = await fetch(`http://localhost:5196/api/BusinessService/countServicesById/${businessId}`);
        const data = await response.json();
        setTotalActiveServices(data.totalActiveServices);
      } catch (error) {
        console.error('Error fetching total active services:', error);
      }
    };

    const fetchTotalActiveTechnicians = async () => {
      try {
        const response = await fetch(`http://localhost:5196/api/Technician/countTechniciansById/${businessId}`);
        const data = await response.json();
        setTotalActiveTechnicians(data.totalActiveTechnicians);
      } catch (error) {
        console.error('Error fetching total active technicians:', error);
      }
    };

    fetchTotalActiveServices();
    fetchTotalActiveTechnicians();

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Bar chart data
  const barData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Appointments',
        data: [12, 19, 8, 15, 20, 25],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Pie chart data
  const pieData = {
    labels: ['Completed', 'Pending', 'Cancelled'],
    datasets: [
      {
        label: 'Appointments Status',
        data: [65, 25, 10],
        backgroundColor: ['#4caf50', '#ff9800', '#f44336'],
        hoverOffset: 4,
      },
    ],
  };

  return (
    <div >
      <section>
        <h2 className='bus-h2'>
          <span>Welcome</span> 
          <span>to</span> 
          <span>your</span> 
          <span>Business</span> 
          <span>Dashboard!</span>
          </h2>
        <div className="business-stats-container">
          <div className="business-stat-card">
            <div className='bus-h3'>Total Requests made</div>
            <div className='bus-p'>2</div>
          </div>
          <div className="business-stat-card">
            <div className='bus-h3'>Total Active Services</div>
            <div className='bus-p'>{totalActiveServices}</div>
            {/* <button>Manage my Services</button> */}
          </div>
          <div className="business-stat-card">
            <div className='bus-h3'>Total Active Technicians</div>
            <div className='bus-p'>{totalActiveTechnicians}</div>
            {/* <button>Manage my Services</button> */}
          </div>
        </div>

        <div className="business-chart-container">
          <div className="business-chart">
            <h3>Monthly Appointments</h3>
           <BusinessBar/>
          </div>

          <div className="business-chart">
            <h3>Services booking status</h3>
            <BusinessPie />
          </div>
        </div>
      </section>
    </div>
  );
};

export default BusinessDashboard;

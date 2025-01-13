import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ViewServices.css";
import { useNavigate } from "react-router-dom";
import { IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import ApprovedDialogComponent from '../../User/DialogComponent/ApprovedDialogComponent';


const ViewServices = () => {
  const [mainServices, setMainServices] = useState([]);
  const [services, setServices] = useState([]);
  const [serviceImages, setServiceImages] = useState({});
  const navigate = useNavigate();

  const fetchServices = async () => {
    try {
      const response = await axios.get("http://localhost:5196/api/Service");
      const mainServicesData = response.data;
      setMainServices(mainServicesData);

      const allServices = [];

      for (const service of mainServicesData) {
        const businessServices = await fetchBusinessService(service.id);
        allServices.push(...businessServices);
      }

      const uniqueServices = allServices.filter(
        (service, index, self) =>
          index === self.findIndex((s) => s.id === service.id)
      );

      setServices(uniqueServices);

      uniqueServices.forEach((service) => fetchServiceImages(service.id));
    } catch (error) {
      console.error("Error fetching main services:", error);
    }
  };

  const fetchBusinessService = async (serviceId) => {
    try {
      const response = await axios.get(
        `http://localhost:5196/api/BusinessService/Service/${serviceId}`
      );
      return response.data || [];
    } catch (error) {
      console.error(
        `Error fetching business services for serviceId ${serviceId}:`,
        error
      );
      return [];
    }
  };

  const fetchServiceImages = async (businessServiceId) => {
    try {
      const response = await axios.get(
        `http://localhost:5196/api/BusinessService/Images/${businessServiceId}`
      );
      setServiceImages((prev) => ({
        ...prev,
        [businessServiceId]: response.data,
      }));
    } catch (error) {
      console.error(
        `Error fetching images for businessServiceId ${businessServiceId}:`,
        error
      );
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const gotodetail = (businessserviceid) => {
    navigate(`/ViewBusinessServiceDetail/${businessserviceid}`);
  };

  return (
    <div>
      <div className="home-service-container">
        {mainServices.map((mainService) => (
          <div key={mainService.id} className="main-service-section">
            <div className="head-container">
              <h2>{mainService.name}</h2>
            </div>
            <div className="services-list">
              {services.filter(
                (service) => service.serviceId === mainService.id
              ).length > 0 ? (
                services
                  .filter((service) => service.serviceId === mainService.id)
                  .map((service) => (
                    <div
                      key={service.id}
                      className="home-service-card"
                      onClick={() => gotodetail(service.id)}
                    >
                      <div className="home-service-header">
                        <h3>Business: {service.business.name}</h3>
                      </div>
                      {serviceImages[service.id] &&
                        serviceImages[service.id].map((image, index) => (
                          <div key={index} className="home-service-image-div">
                            <img
                              className="home-service-image"
                              src={image.imageUrl}
                              alt={`Service ${index}`}
                              height={150}
                              width={150}
                            />
                          </div>
                        ))}
                      <div className="home-service-details">
                        <p>
                          <strong>Description:</strong>{" "}
                          {service.service.description}
                        </p>
                        <h3> {service.price}/-</h3>
                      </div>
                    </div>
                  ))
              ) : (
                <p>
                  Currently, no businesses are offering this service. Please
                  check back later.
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewServices;

import React, { useState, useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import { useNavigate } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import "./MapLayout.css";

const MapLayout = () => {
  const [position, setPosition] = useState(null); // User's position
  const [address, setAddress] = useState("");
  const [latLng, setLatLng] = useState({ lat: null, lng: null });
  const [businesses, setBusinesses] = useState([]); // All business data
  const [filteredBusinesses, setFilteredBusinesses] = useState([]); // Filtered businesses based on search
  const [route, setRoute] = useState([]); // Store route coordinates
  const [directions, setDirections] = useState([]); // Store turn-by-turn directions
  const [selectedBusiness, setSelectedBusiness] = useState(null); // Store selected business for directions
  const [showRoute, setShowRoute] = useState(false); // Control visibility of route
  const [searchQuery, setSearchQuery] = useState(""); // Track the search query
  const navigate = useNavigate();

  const mapRef = useRef(null); // Reference to the map container
  const apiKey = "5b3ce3597851110001cf624837ef2e934b8a496abc433f8914da963e"; // Replace with your OpenRouteService API key

  // Get user's current location
  useEffect(() => {
    askForLocation();
    fetchBusinesses();
  }, []);

  const askForLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(
        (pos) => {
          const userPosition = [pos.coords.latitude, pos.coords.longitude];
          setPosition(userPosition);
          setLatLng({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          fetchAddress(pos.coords.latitude, pos.coords.longitude);
          updateUserRoute(userPosition); // Track the user's movement
        },
        () => {
          //alert("Unable to retrieve your location.");
        },
        {
          enableHighAccuracy: true,
          maximumAge: 10000,
          timeout: 5000,
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  // Fetch address using reverse geocoding
  const fetchAddress = async (lat, lng) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      setAddress(response.data.display_name);
    } catch (error) {
      console.error("Error fetching address:", error);
    }
  };

  // Fetch businesses data from the API
  const fetchBusinesses = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5196/api/Business/All"
      ); // Replace with your actual API endpoint
      setBusinesses(response.data);
      setFilteredBusinesses(response.data); // Initially show all businesses
    } catch (error) {
      console.error("Error fetching businesses:", error);
    }
  };

  // Filter businesses based on search query
  const filterBusinesses = (query) => {
    if (!query) {
      setFilteredBusinesses([]); // If search is empty, hide the business list
    } else {
      const filtered = businesses.filter((business) => {
        return business.name.toLowerCase().includes(query.toLowerCase());
      });
      setFilteredBusinesses(filtered);
    }
  };

  // Handle search query change
  const handleSearchQueryChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    filterBusinesses(query);
    if (e.target.value === "") {
      fetchBusinesses();
    }
  };
  const fetchDirections = async (startLat, startLng, endLat, endLng) => {
    const url = "https://api.openrouteservice.org/v2/directions/driving-car";
  
    try {
      const response = await axios.get(url, {
        params: {
          start: `${startLng},${startLat}`, // Format as 'longitude,latitude'
          end: `${endLng},${endLat}`, // Format as 'longitude,latitude'
          api_key: apiKey, // Make sure to pass the correct API key as required
        },
        headers: {
          Authorization: apiKey, // API key for OpenRouteService
        },
      });
  
      if (response.data.features && response.data.features.length > 0) {
        const coordinates = response.data.features[0].geometry.coordinates;
        const directions =
          response.data.features[0].properties.segments[0].steps;
  
        // Convert to Leaflet-friendly [lat, lng] format
        const leafletCoordinates = coordinates.map(([lng, lat]) => [lat, lng]);
        setRoute(leafletCoordinates); // Set route
        setDirections(directions); // Set directions (step-by-step)
        setShowRoute(true); // Show the route on the map
      } else {
        alert("No route found.");
      }
    } catch (error) {
      console.error("Error fetching directions:", error);
      alert("Unable to fetch directions. Please try again.");
    }
  };
  
  // Fetch turn-by-turn directions
  // const fetchDirections = async (startLat, startLng, endLat, endLng) => {
  //   const url = "https://api.openrouteservice.org/v2/directions/driving-car";

  //   try {
  //     const response = await axios.get(url, {
  //       params: {
  //         start: `${startLng},${startLat}`, // Format as 'longitude,latitude'
  //         end: `${endLng},${endLat}`, // Format as 'longitude,latitude'
  //       },
  //       headers: {
  //         Authorization: apiKey, // API key for OpenRouteService
  //       },
  //     });

  //     if (response.data.features && response.data.features.length > 0) {
  //       const coordinates = response.data.features[0].geometry.coordinates;
  //       const directions =
  //         response.data.features[0].properties.segments[0].steps;

  //       // Convert to Leaflet-friendly [lat, lng] format
  //       const leafletCoordinates = coordinates.map(([lng, lat]) => [lat, lng]);
  //       setRoute(leafletCoordinates); // Set route
  //       setDirections(directions); // Set directions (step-by-step)
  //       setShowRoute(true); // Show the route on the map
  //     } else {
  //       alert("No route found.");
  //     }
  //   } catch (error) {
  //     console.error("Error fetching directions:", error);
  //     alert("Unable to fetch directions. Please try again.");
  //   }
  // };

  // Update the user's route based on their current position
  const updateUserRoute = (newPosition) => {
    if (selectedBusiness) {
      const startLat = newPosition[0];
      const startLng = newPosition[1];
      const endLat = selectedBusiness.address.latitude;
      const endLng = selectedBusiness.address.longitude;
      fetchDirections(startLat, startLng, endLat, endLng); // Re-fetch directions based on current position
    }
  };

  // Handle "Get Directions" button click
  const handleGetDirections = () => {
    if (selectedBusiness) {
      fetchDirections(
        latLng.lat,
        latLng.lng,
        selectedBusiness.address.latitude,
        selectedBusiness.address.longitude
      );
    }
  };

  const handleViewBusiness = (businessId) => {
    navigate(`/ViewBusinessService/${businessId}`);
  };

  // Handle business click to zoom into that business on the map
  const handleBusinessClick = (business) => {
    setRoute([]); // Clear previous route
    setShowRoute(false); // Hide previous route
    setDirections([]); // Clear directions
    setSelectedBusiness(business);
    if (mapRef.current) {
      mapRef.current.setView(
        [business.address.latitude, business.address.longitude],
        15
      ); // Zoom into the business
    }
  };

  return (
    <div className="map-container">
      <div className="map-main-content">
        <div className="left-bus-content">
          <h3 className="h3for-bus">Look for Businesses Near You!</h3>
          <h1 className="h1for-bus">
            Effortlessly search for businesses around you, view them on the map,
            and book your desired services – all at your fingertips
          </h1>
          <div>
            <input
              type="text"
              value={searchQuery}
              placeholder="Search businesses..."
              onChange={handleSearchQueryChange}
              className="search-for-business"
            />
            {searchQuery && (
              <div className="business-list">
                {filteredBusinesses.length === 0 ? (
                  <p>No businesses found.</p>
                ) : (
                  filteredBusinesses.map((business) => (
                    <div key={business.id}>
                      <h4
                        className="business-name"
                        style={{ cursor: "pointer", color: "#007bff" }}
                        onClick={() => handleBusinessClick(business)}
                      >
                        {business.name}
                      </h4>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        <div className="right-content">
          <div className="map-map-container">
            {position ? (
              <MapContainer
                center={latLng}
                zoom={12}
                className="map-map"
                ref={mapRef} // Assign the map reference to control it
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker
                  position={latLng}
                  draggable={false}
                  icon={
                    new L.Icon({
                      iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
                      shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png", // Optional shadow
                      iconSize: [25, 41], // Size of the icon
                      iconAnchor: [12, 41], // Point of the icon which corresponds to marker's location
                      popupAnchor: [1, -34], // Point from which the popup should open relative to the iconAnchor
                      shadowSize: [41, 41] // Optional shadow size
                    })
                  }
                >
                  <Popup>{`address ? Address: ${address} : 'Locating...'`}</Popup>
                </Marker>

                {/* Map Businesses */}
                {filteredBusinesses.map((business) => {
                  // Check if business address exists before rendering the marker
                  if (
                    business.address &&
                    business.address.latitude &&
                    business.address.longitude
                  ) {
                    return (
                      <Marker
                        key={business.id}
                        position={[
                          business.address.latitude,
                          business.address.longitude,
                        ]}
                        icon={
                          new L.Icon({
                            iconUrl: require("leaflet/dist/images/marker-icon.png"),
                            iconSize: [25, 41],
                            iconAnchor: [12, 41],
                            popupAnchor: [0, -41],
                          })
                        }
                        eventHandlers={{
                          click: () => handleBusinessClick(business),
                        }}
                      >
                        <Popup>
                          <strong>{business.name}</strong>
                          <br />
                          {business.contactNo}
                          <br />
                          Lat: {business.address.latitude} Long:
                          {business.address.longitude}
                          <br />
                          <div style={{ flexDirection: "row" }}>
                            <button onClick={handleGetDirections}>
                              Get Directions
                            </button>
                            <button
                              onClick={() => {
                                handleViewBusiness(business.id);
                              }}
                            >
                              View Business
                            </button>
                          </div>
                        </Popup>
                      </Marker>
                    );
                  } else {
                    return null; // If no valid address, don't render the marker
                  }
                })}

                {showRoute && route.length > 0 && (
                  <Polyline positions={route} color="blue" />
                )}
              </MapContainer>
            ) : (
              <p>Loading map...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapLayout;

// import React, { useState, useEffect, useRef } from 'react';
// import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
// import { useNavigate } from 'react-router-dom';
// import L from 'leaflet';
// import 'leaflet/dist/leaflet.css';
// import axios from 'axios';
// import './MapLayout.css';

// const MapLayout = () => {
//   const [position, setPosition] = useState(null); // User's position
//   const [address, setAddress] = useState('');
//   const [latLng, setLatLng] = useState({ lat: null, lng: null });
//   const [businesses, setBusinesses] = useState([]); // All business data
//   const [filteredBusinesses, setFilteredBusinesses] = useState([]); // Filtered businesses based on search
//   const [route, setRoute] = useState([]); // Store route coordinates
//   const [directions, setDirections] = useState([]); // Store turn-by-turn directions
//   const [selectedBusiness, setSelectedBusiness] = useState(null); // Store selected business for directions
//   const [showRoute, setShowRoute] = useState(false); // Control visibility of route
//   const [searchQuery, setSearchQuery] = useState(''); // Track the search query
//   const navigate = useNavigate();

//   const mapRef = useRef(null); // Reference to the map container
//   const apiKey = '5b3ce3597851110001cf624837ef2e934b8a496abc433f8914da963e'; // Replace with your OpenRouteService API key

//   // Get user's current location
//   useEffect(() => {
//     const askForLocation = () => {
//       if (navigator.geolocation) {
//         navigator.geolocation.watchPosition(
//           (pos) => {
//             const userPosition = [pos.coords.latitude, pos.coords.longitude];
//             setPosition(userPosition);
//             setLatLng({ lat: pos.coords.latitude, lng: pos.coords.longitude });
//             fetchAddress(pos.coords.latitude, pos.coords.longitude);
//           },
//           () => {
//             alert('Unable to retrieve your location.');
//           },
//           {
//             enableHighAccuracy: true,
//             maximumAge: 10000,
//             timeout: 5000,
//           }
//         );
//       } else {
//         alert('Geolocation is not supported by this browser.');
//       }
//     };

//     askForLocation();
//   }, []);

//   // Fetch address using reverse geocoding
//   const fetchAddress = async (lat, lng) => {
//     try {
//       const response = await axios.get(
//         https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}
//       );
//       setAddress(response.data.display_name);
//     } catch (error) {
//       console.error('Error fetching address:', error);
//     }
//   };

//   // Fetch businesses data from the API
//   const fetchBusinesses = async () => {
//     try {
//       const response = await axios.get('http://localhost:5196/api/Business/All'); // Replace with your actual API endpoint
//       setBusinesses(response.data);
//       setFilteredBusinesses(response.data); // Initially show all businesses
//     } catch (error) {
//       console.error('Error fetching businesses:', error);
//     }
//   };

//   // Filter businesses based on search query
//   const filterBusinesses = (query) => {
//     if (!query) {
//       setFilteredBusinesses(businesses); // If search is empty, show all businesses
//     } else {
//       const filtered = businesses.filter((business) => {
//         return business.name.toLowerCase().includes(query.toLowerCase());
//       });
//       setFilteredBusinesses(filtered);
//     }
//   };

//   // Handle search query change
//   const handleSearchQueryChange = (e) => {
//     const query = e.target.value;
//     setSearchQuery(query);
//     filterBusinesses(query); // Filter businesses based on the query
//   };

//   // Handle business click to zoom into that business on the map
//   const handleBusinessClick = (business) => {
//     setSelectedBusiness(business);
//     if (mapRef.current) {
//       mapRef.current.setView([business.address.latitude, business.address.longitude], 15); // Zoom into the business
//     }
//   };

//   useEffect(() => {
//     fetchBusinesses();
//   }, []);

//   return (
//     <div className="map-container">
//       <div className="map-main-content">
//         <div className="">
//           <h3>Business Listings</h3>
//           <input
//             type="text"
//             value={searchQuery}
//             placeholder="Search businesses..."
//             onChange={handleSearchQueryChange}
//           />
//           <div className="business-list">
//             {filteredBusinesses.length === 0 ? (
//               <p>No businesses found.</p>
//             ) : (
//               filteredBusinesses.map((business) => (
//                 <div key={business.id}>
//                   <h4
//                     className="business-name"
//                     style={{ cursor: 'pointer', color: '#007bff' }}
//                     onClick={() => handleBusinessClick(business)}
//                   >
//                     {business.name}
//                   </h4>
//                 </div>
//               ))
//             )}
//           </div>
//         </div>
// <div className='right-content'>
//         <div className="map-map-container">
//           {position ? (
//             <MapContainer
//               center={latLng}
//               zoom={15}
//               className='map-map'
//               // style={{ height: '400px', width: '100%' }}
//               ref={mapRef} // Assign the map reference to control it
//             >
//               <TileLayer
//                 url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//                 attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//               />
//               <Marker
//                 position={latLng}
//                 draggable={false}
//                 icon={new L.Icon({
//                   iconUrl: require('leaflet/dist/images/marker-icon.png'),
//                   iconSize: [25, 41],
//                   iconAnchor: [12, 41],
//                   popupAnchor: [0, -41],
//                 })}
//               >
//                 <Popup>{address ? Address: ${address} : 'Locating...'}</Popup>
//               </Marker>

//               {/* Map Businesses */}
//               {filteredBusinesses.map((business) => {
//                 // Check if business address exists before rendering the marker
//                 if (business.address && business.address.latitude && business.address.longitude) {
//                   return (
//                     <Marker
//                       key={business.businessId}
//                       position={[business.address.latitude, business.address.longitude]}
//                       icon={new L.Icon({
//                         iconUrl: require('leaflet/dist/images/marker-icon.png'),
//                         iconSize: [25, 41],
//                         iconAnchor: [12, 41],
//                         popupAnchor: [0, -41],
//                       })}
//                     >
//                       <Popup>{business.name}</Popup>
//                     </Marker>
//                   );
//                 } else {
//                   return null; // If no valid address, don't render the marker
//                 }
//               })}

//               {showRoute && <Polyline positions={route} color="blue" weight={5} />}
//             </MapContainer>
//           ) : (
//             <p>Loading map...</p>
//           )}
//         </div>
//       </div>
//       </div>
//     </div>
//   );
// };

// export default MapLayout;

// Chalto code
// import React, { useState, useEffect } from 'react';
// import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
// import { useNavigate } from "react-router-dom";
// import L from 'leaflet';
// import 'leaflet/dist/leaflet.css';
// import axios from 'axios';
// import './MapLayout.css';

// const MapLayout = () => {
//   const [position, setPosition] = useState(null); // User's position
//   const [address, setAddress] = useState('');
//   const [latLng, setLatLng] = useState({ lat: null, lng: null });
//   const [businesses, setBusinesses] = useState([]); // All business data
//   const [filteredBusinesses, setFilteredBusinesses] = useState([]); // Businesses after search
//   const [route, setRoute] = useState([]); // Store route coordinates
//   const [directions, setDirections] = useState([]); // Store turn-by-turn directions
//   const [selectedBusiness, setSelectedBusiness] = useState(null); // Store selected business for directions
//   const [showRoute, setShowRoute] = useState(false); // Control visibility of route
//   const [userRoute, setUserRoute] = useState([]); // To track user's movement
//   const navigate = useNavigate();
//   const indiaBounds = [
//     [6.5546079, 68.1113787], // South-West point
//     [35.6745457, 97.395561], // North-East point
//   ]; // Approximate bounds for India

//   const apiKey = '5b3ce3597851110001cf624837ef2e934b8a496abc433f8914da963e'; // Replace with your OpenRouteService API key

//   // Get user's current location
//   useEffect(() => {
//     const askForLocation = () => {
//       if (navigator.geolocation) {
//         navigator.geolocation.watchPosition(
//           (pos) => {
//             const userPosition = [pos.coords.latitude, pos.coords.longitude];
//             setPosition(userPosition);
//             setLatLng({ lat: pos.coords.latitude, lng: pos.coords.longitude });
//             fetchAddress(pos.coords.latitude, pos.coords.longitude);
//             updateUserRoute(userPosition); // Track the user's movement
//           },
//           () => {
//             alert("Unable to retrieve your location.");
//           },
//           {
//             enableHighAccuracy: true,
//             maximumAge: 10000,
//             timeout: 5000,
//           }
//         );
//       } else {
//         alert("Geolocation is not supported by this browser.");
//       }
//     };

//     askForLocation();
//   }, []);

//   // Fetch address using reverse geocoding
//   const fetchAddress = async (lat, lng) => {
//     try {
//       const response = await axios.get(
//         https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}
//       );
//       setAddress(response.data.display_name);
//     } catch (error) {
//       console.error("Error fetching address:", error);
//     }
//   };

//   // Fetch businesses data
//   const fetchBusinesses = async () => {
//     try {
//       const response = await axios.get('http://localhost:5196/api/Business/All'); // Replace with your actual API endpoint
//       setBusinesses(response.data);
//       setFilteredBusinesses(response.data); // Initially show all businesses
//     } catch (error) {
//       console.error("Error fetching businesses:", error);
//     }
//   };

//   useEffect(() => {
//     fetchBusinesses(); // Fetch businesses data when the component mounts
//   }, []);

//   // Handle search
//   const handleSearch = (query) => {
//     if (query) {
//       const filtered = businesses.filter(business =>
//         business.name.toLowerCase().includes(query.toLowerCase())
//       )
//       setFilteredBusinesses(filtered);
//     } else {
//       setFilteredBusinesses(businesses); // Show all businesses if search is empty
//     }
//   };

//   // Fetch turn-by-turn directions
//   const fetchDirections = async (startLat, startLng, endLat, endLng) => {
//     const url = 'https://api.openrouteservice.org/v2/directions/driving-car';

//     try {
//       const response = await axios.get(url, {
//         params: {
//           start: ${startLng},${startLat}, // Format as 'longitude,latitude'
//           end: ${endLng},${endLat}, // Format as 'longitude,latitude'
//         },
//         headers: {
//           Authorization: apiKey, // API key for OpenRouteService
//         },
//       });

//       if (response.data.features && response.data.features.length > 0) {
//         const coordinates = response.data.features[0].geometry.coordinates;
//         const directions = response.data.features[0].properties.segments[0].steps;

//         // Convert to Leaflet-friendly [lat, lng] format
//         const leafletCoordinates = coordinates.map(([lng, lat]) => [lat, lng]);
//         setRoute(leafletCoordinates); // Set route
//         setDirections(directions); // Set directions (step-by-step)
//         setShowRoute(true); // Show the route on the map
//       } else {
// 
// 
// 
// 
// 
// 
// 
// 
// 
// // import React, { useState, useEffect, useRef } from 'react';
// import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
// import { useNavigate } from 'react-router-dom';
// import L from 'leaflet';
// import 'leaflet/dist/leaflet.css';
// import axios from 'axios';
// import './MapLayout.css';

// const MapLayout = () => {
//   const [position, setPosition] = useState(null); // User's position
//   const [address, setAddress] = useState('');
//   const [latLng, setLatLng] = useState({ lat: null, lng: null });
//   const [businesses, setBusinesses] = useState([]); // All business data
//   const [filteredBusinesses, setFilteredBusinesses] = useState([]); // Filtered businesses based on search
//   const [route, setRoute] = useState([]); // Store route coordinates
//   const [directions, setDirections] = useState([]); // Store turn-by-turn directions
//   const [selectedBusiness, setSelectedBusiness] = useState(null); // Store selected business for directions
//   const [showRoute, setShowRoute] = useState(false); // Control visibility of route
//   const [searchQuery, setSearchQuery] = useState(''); // Track the search query
//   const navigate = useNavigate();

//   const mapRef = useRef(null); // Reference to the map container
//   const apiKey = '5b3ce3597851110001cf624837ef2e934b8a496abc433f8914da963e'; // Replace with your OpenRouteService API key

//   // Get user's current location

//     const askForLocation = () => {
//       if (navigator.geolocation) {
//         navigator.geolocation.watchPosition(
//           (pos) => {
//             const userPosition = [pos.coords.latitude, pos.coords.longitude];
//             setPosition(userPosition);
//             setLatLng({ lat: pos.coords.latitude, lng: pos.coords.longitude });
//             fetchAddress(pos.coords.latitude, pos.coords.longitude);
//           },
//           () => {
//             alert('Unable to retrieve your location.');
//           },
//           {
//             enableHighAccuracy: true,
//             maximumAge: 10000,
//             timeout: 5000,
//           }
//         );
//       } else {
//         alert('Geolocation is not supported by this browser.');
//       }
//     };

//     useEffect(() => {
//     askForLocation();
//     fetchBusinesses(); 
//   }, []);

//   // Fetch address using reverse geocoding
//   const fetchAddress = async (lat, lng) => {
//     try {
//       const response = await axios.get(
//         `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
//       );
//       setAddress(response.data.display_name);
//     } catch (error) {
//       console.error('Error fetching address:', error);
//     }
//   };

//   // Fetch businesses data from the API
//   const fetchBusinesses = async () => {
//     try {
//       const response = await axios.get('http://localhost:5196/api/Business/All'); // Replace with your actual API endpoint
//       setBusinesses(response.data);
//       setFilteredBusinesses(response.data); // Initially show all businesses
//     } catch (error) {
//       console.error('Error fetching businesses:', error);
//     }
//   };

//   // Filter businesses based on search query
//   const filterBusinesses = (query) => {
//     if (!query) {
//       setFilteredBusinesses([]); // If search is empty, hide the business list
//     } else {
//       const filtered = businesses.filter((business) => {
//         return business.name.toLowerCase().includes(query.toLowerCase());
//       });
//       setFilteredBusinesses(filtered);
//     }
//   };

//   // Handle search query change
//   const handleSearchQueryChange = (e) => {
//     const query = e.target.value;
//     setSearchQuery(query);
//     filterBusinesses(query); // Filter businesses based on the query
//   };

//   // Handle business click to zoom into that business on the map
//   const handleBusinessClick = (business) => {
//     setSelectedBusiness(business);
//     if (mapRef.current) {
//       mapRef.current.setView([business.address.latitude, business.address.longitude], 15); // Zoom into the business
//     }
//   };

//   return (
//     <div className="map-container">
//       <div className="map-main-content">
//         <div className="left-bus-content">
//           <h3 className='h3for-bus'>Look for Businesses Near You!</h3>
//           <h1 className='h1for-bus'>Effortlessly search for businesses around you, view them on the map, and book your desired services – all at your fingertips</h1>
//           <div>
//           <input
//             type="text"
//             value={searchQuery}
//             placeholder="Search businesses..."
//             onChange={handleSearchQueryChange}
//             className='search-for-business'
//           />
//           {searchQuery && (
//             <div className="business-list">
//               {filteredBusinesses.length === 0 ? (
//                 <p>No businesses found.</p>
//               ) : (
//                 filteredBusinesses.map((business) => (
//                   <div key={business.id}>
//                     <h4
//                       className="business-name"
//                       style={{ cursor: 'pointer', color: '#007bff' }}
//                       onClick={() => handleBusinessClick(business)}
//                     >
//                       {business.name}
//                     </h4>
//                   </div>
//                 ))
//               )}
//             </div>
//           )}
//           </div>
//         </div>

//         <div className='right-content'>
//           <div className="map-map-container">
//             {position ? (
//               <MapContainer
//                 center={latLng}
//                 zoom={15}
//                 className='map-map'
//                 ref={mapRef} // Assign the map reference to control it
//               >
//                 <TileLayer
//                   url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//                   attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//                 />
//                 <Marker
//                   position={latLng}
//                   draggable={false}
//                   icon={new L.Icon({
//                     iconUrl: require('leaflet/dist/images/marker-icon.png'),
//                     iconSize: [25, 41],
//                     iconAnchor: [12, 41],
//                     popupAnchor: [0, -41],
//                   })}
//                 >
//                   <Popup>{address ? `Address: ${address}` : 'Locating...'}</Popup>
//                 </Marker>

//                 {/* Map Businesses */}
//                 {filteredBusinesses.map((business) => {
//                   // Check if business address exists before rendering the marker
//                   if (business.address && business.address.latitude && business.address.longitude) {
//                     return (
//                       <Marker
//                         key={business.businessId}
//                         position={[business.address.latitude, business.address.longitude]}
//                         icon={new L.Icon({
//                           iconUrl: require('leaflet/dist/images/marker-icon.png'),
//                           iconSize: [25, 41],
//                           iconAnchor: [12, 41],
//                           popupAnchor: [0, -41],
//                         })}
//                       >
//                         <Popup>{business.name}</Popup>
//                       </Marker>
//                     );
//                   } else {
//                     return null; // If no valid address, don't render the marker
//                   }
//                 })}

//                 {showRoute && <Polyline positions={route} color="blue" weight={5} />}
//               </MapContainer>
//             ) : (
//               <p>Loading map...</p>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MapLayout;


// // import React, { useState, useEffect, useRef } from 'react';
// // import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
// // import { useNavigate } from 'react-router-dom';
// // import L from 'leaflet';
// // import 'leaflet/dist/leaflet.css';
// // import axios from 'axios';
// // import './MapLayout.css';

// // const MapLayout = () => {
// //   const [position, setPosition] = useState(null); // User's position
// //   const [address, setAddress] = useState('');
// //   const [latLng, setLatLng] = useState({ lat: null, lng: null });
// //   const [businesses, setBusinesses] = useState([]); // All business data
// //   const [filteredBusinesses, setFilteredBusinesses] = useState([]); // Filtered businesses based on search
// //   const [route, setRoute] = useState([]); // Store route coordinates
// //   const [directions, setDirections] = useState([]); // Store turn-by-turn directions
// //   const [selectedBusiness, setSelectedBusiness] = useState(null); // Store selected business for directions
// //   const [showRoute, setShowRoute] = useState(false); // Control visibility of route
// //   const [searchQuery, setSearchQuery] = useState(''); // Track the search query
// //   const navigate = useNavigate();

// //   const mapRef = useRef(null); // Reference to the map container
// //   const apiKey = '5b3ce3597851110001cf624837ef2e934b8a496abc433f8914da963e'; // Replace with your OpenRouteService API key

// //   // Get user's current location
// //   useEffect(() => {
// //     const askForLocation = () => {
// //       if (navigator.geolocation) {
// //         navigator.geolocation.watchPosition(
// //           (pos) => {
// //             const userPosition = [pos.coords.latitude, pos.coords.longitude];
// //             setPosition(userPosition);
// //             setLatLng({ lat: pos.coords.latitude, lng: pos.coords.longitude });
// //             fetchAddress(pos.coords.latitude, pos.coords.longitude);
// //           },
// //           () => {
// //             alert('Unable to retrieve your location.');
// //           },
// //           {
// //             enableHighAccuracy: true,
// //             maximumAge: 10000,
// //             timeout: 5000,
// //           }
// //         );
// //       } else {
// //         alert('Geolocation is not supported by this browser.');
// //       }
// //     };

// //     askForLocation();
// //   }, []);

// //   // Fetch address using reverse geocoding
// //   const fetchAddress = async (lat, lng) => {
// //     try {
// //       const response = await axios.get(
// //         `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
// //       );
// //       setAddress(response.data.display_name);
// //     } catch (error) {
// //       console.error('Error fetching address:', error);
// //     }
// //   };

// //   // Fetch businesses data from the API
// //   const fetchBusinesses = async () => {
// //     try {
// //       const response = await axios.get('http://localhost:5196/api/Business/All'); // Replace with your actual API endpoint
// //       setBusinesses(response.data);
// //       setFilteredBusinesses(response.data); // Initially show all businesses
// //     } catch (error) {
// //       console.error('Error fetching businesses:', error);
// //     }
// //   };

// //   // Filter businesses based on search query
// //   const filterBusinesses = (query) => {
// //     if (!query) {
// //       setFilteredBusinesses(businesses); // If search is empty, show all businesses
// //     } else {
// //       const filtered = businesses.filter((business) => {
// //         return business.name.toLowerCase().includes(query.toLowerCase());
// //       });
// //       setFilteredBusinesses(filtered);
// //     }
// //   };

// //   // Handle search query change
// //   const handleSearchQueryChange = (e) => {
// //     const query = e.target.value;
// //     setSearchQuery(query);
// //     filterBusinesses(query); // Filter businesses based on the query
// //   };

// //   // Handle business click to zoom into that business on the map
// //   const handleBusinessClick = (business) => {
// //     setSelectedBusiness(business);
// //     if (mapRef.current) {
// //       mapRef.current.setView([business.address.latitude, business.address.longitude], 15); // Zoom into the business
// //     }
// //   };

// //   useEffect(() => {
// //     fetchBusinesses(); 
// //   }, []);

// //   return (
// //     <div className="map-container">
// //       <div className="map-main-content">
// //         <div className="">
// //           <h3>Business Listings</h3>
// //           <input
// //             type="text"
// //             value={searchQuery}
// //             placeholder="Search businesses..."
// //             onChange={handleSearchQueryChange}
// //           />
// //           <div className="business-list">
// //             {filteredBusinesses.length === 0 ? (
// //               <p>No businesses found.</p>
// //             ) : (
// //               filteredBusinesses.map((business) => (
// //                 <div key={business.id}>
// //                   <h4
// //                     className="business-name"
// //                     style={{ cursor: 'pointer', color: '#007bff' }}
// //                     onClick={() => handleBusinessClick(business)}
// //                   >
// //                     {business.name}
// //                   </h4>
// //                 </div>
// //               ))
// //             )}
// //           </div>
// //         </div>
// // <div className='right-content'>
// //         <div className="map-map-container">
// //           {position ? (
// //             <MapContainer
// //               center={latLng}
// //               zoom={15}
// //               className='map-map'
// //               // style={{ height: '400px', width: '100%' }}
// //               ref={mapRef} // Assign the map reference to control it
// //             >
// //               <TileLayer
// //                 url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
// //                 attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
// //               />
// //               <Marker
// //                 position={latLng}
// //                 draggable={false}
// //                 icon={new L.Icon({
// //                   iconUrl: require('leaflet/dist/images/marker-icon.png'),
// //                   iconSize: [25, 41],
// //                   iconAnchor: [12, 41],
// //                   popupAnchor: [0, -41],
// //                 })}
// //               >
// //                 <Popup>{address ? `Address: ${address}` : 'Locating...'}</Popup>
// //               </Marker>

// //               {/* Map Businesses */}
// //               {filteredBusinesses.map((business) => {
// //                 // Check if business address exists before rendering the marker
// //                 if (business.address && business.address.latitude && business.address.longitude) {
// //                   return (
// //                     <Marker
// //                       key={business.businessId}
// //                       position={[business.address.latitude, business.address.longitude]}
// //                       icon={new L.Icon({
// //                         iconUrl: require('leaflet/dist/images/marker-icon.png'),
// //                         iconSize: [25, 41],
// //                         iconAnchor: [12, 41],
// //                         popupAnchor: [0, -41],
// //                       })}
// //                     >
// //                       <Popup>{business.name}</Popup>
// //                     </Marker>
// //                   );
// //                 } else {
// //                   return null; // If no valid address, don't render the marker
// //                 }
// //               })}

// //               {showRoute && <Polyline positions={route} color="blue" weight={5} />}
// //             </MapContainer>
// //           ) : (
// //             <p>Loading map...</p>
// //           )}
// //         </div>
// //       </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default MapLayout;






// // Chalto code
// // import React, { useState, useEffect } from 'react';
// // import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
// // import { useNavigate } from "react-router-dom";
// // import L from 'leaflet';
// // import 'leaflet/dist/leaflet.css';
// // import axios from 'axios';
// // import './MapLayout.css';

// // const MapLayout = () => {
// //   const [position, setPosition] = useState(null); // User's position
// //   const [address, setAddress] = useState('');
// //   const [latLng, setLatLng] = useState({ lat: null, lng: null });
// //   const [businesses, setBusinesses] = useState([]); // All business data
// //   const [filteredBusinesses, setFilteredBusinesses] = useState([]); // Businesses after search
// //   const [route, setRoute] = useState([]); // Store route coordinates
// //   const [directions, setDirections] = useState([]); // Store turn-by-turn directions
// //   const [selectedBusiness, setSelectedBusiness] = useState(null); // Store selected business for directions
// //   const [showRoute, setShowRoute] = useState(false); // Control visibility of route
// //   const [userRoute, setUserRoute] = useState([]); // To track user's movement
// //   const navigate = useNavigate();
// //   const indiaBounds = [
// //     [6.5546079, 68.1113787], // South-West point
// //     [35.6745457, 97.395561], // North-East point
// //   ]; // Approximate bounds for India

// //   const apiKey = '5b3ce3597851110001cf624837ef2e934b8a496abc433f8914da963e'; // Replace with your OpenRouteService API key

// //   // Get user's current location
// //   useEffect(() => {
// //     const askForLocation = () => {
// //       if (navigator.geolocation) {
// //         navigator.geolocation.watchPosition(
// //           (pos) => {
// //             const userPosition = [pos.coords.latitude, pos.coords.longitude];
// //             setPosition(userPosition);
// //             setLatLng({ lat: pos.coords.latitude, lng: pos.coords.longitude });
// //             fetchAddress(pos.coords.latitude, pos.coords.longitude);
// //             updateUserRoute(userPosition); // Track the user's movement
// //           },
// //           () => {
// //             alert("Unable to retrieve your location.");
// //           },
// //           {
// //             enableHighAccuracy: true,
// //             maximumAge: 10000,
// //             timeout: 5000,
// //           }
// //         );
// //       } else {
// //         alert("Geolocation is not supported by this browser.");
// //       }
// //     };

// //     askForLocation();
// //   }, []);

// //   // Fetch address using reverse geocoding
// //   const fetchAddress = async (lat, lng) => {
// //     try {
// //       const response = await axios.get(
// //         `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
// //       );
// //       setAddress(response.data.display_name);
// //     } catch (error) {
// //       console.error("Error fetching address:", error);
// //     }
// //   };

// //   // Fetch businesses data
// //   const fetchBusinesses = async () => {
// //     try {
// //       const response = await axios.get('http://localhost:5196/api/Business/All'); // Replace with your actual API endpoint
// //       setBusinesses(response.data);
// //       setFilteredBusinesses(response.data); // Initially show all businesses
// //     } catch (error) {
// //       console.error("Error fetching businesses:", error);
// //     }
// //   };

// //   useEffect(() => {
// //     fetchBusinesses(); // Fetch businesses data when the component mounts
// //   }, []);

// //   // Handle search
// //   const handleSearch = (query) => {
// //     if (query) {
// //       const filtered = businesses.filter(business =>
// //         business.name.toLowerCase().includes(query.toLowerCase()) 
// //       )
// //       setFilteredBusinesses(filtered);
// //     } else {
// //       setFilteredBusinesses(businesses); // Show all businesses if search is empty
// //     }
// //   };

// //   // Fetch turn-by-turn directions
// //   const fetchDirections = async (startLat, startLng, endLat, endLng) => {
// //     const url = 'https://api.openrouteservice.org/v2/directions/driving-car';

// //     try {
// //       const response = await axios.get(url, {
// //         params: {
// //           start: `${startLng},${startLat}`, // Format as 'longitude,latitude'
// //           end: `${endLng},${endLat}`, // Format as 'longitude,latitude'
// //         },
// //         headers: {
// //           Authorization: apiKey, // API key for OpenRouteService
// //         },
// //       });

// //       if (response.data.features && response.data.features.length > 0) {
// //         const coordinates = response.data.features[0].geometry.coordinates;
// //         const directions = response.data.features[0].properties.segments[0].steps;

// //         // Convert to Leaflet-friendly [lat, lng] format
// //         const leafletCoordinates = coordinates.map(([lng, lat]) => [lat, lng]);
// //         setRoute(leafletCoordinates); // Set route
// //         setDirections(directions); // Set directions (step-by-step)
// //         setShowRoute(true); // Show the route on the map
// //       } else {
// //         alert('No route found.');
// //       }
// //     } catch (error) {
// //       console.error('Error fetching directions:', error);
// //       alert('Unable to fetch directions. Please try again.');
// //     }
// //   };

// //   // Update the user's route based on their current position
// //   const updateUserRoute = (newPosition) => {
// //     if (selectedBusiness) {
// //       const startLat = newPosition[0];
// //       const startLng = newPosition[1];
// //       const endLat = selectedBusiness.address.latitude;
// //       const endLng = selectedBusiness.address.longitude;
// //       fetchDirections(startLat, startLng, endLat, endLng); // Re-fetch directions based on current position
// //     }
// //   };

// //   // Handle business click to show directions
// //   const handleBusinessClick = (business) => {
// //     setSelectedBusiness(business);
// //     setRoute([]); // Clear previous route
// //     setShowRoute(false); // Hide previous route
// //     setDirections([]); // Clear directions
// //   };

// //   // Handle "Get Directions" button click
// //   const handleGetDirections = () => {
// //     if (selectedBusiness) {
// //       fetchDirections(
// //         latLng.lat,
// //         latLng.lng,
// //         selectedBusiness.address.latitude,
// //         selectedBusiness.address.longitude
// //       );
// //     }
// //   };

// //   const handleViewBusiness = (businessId) => {
// //     navigate(`/ViewBusinessService/${businessId}`);
// //   };

// //   return (
// //     <div className="map-container">
// //       <div className="map-main-content">
// //       <div className="right-content">
// //           <h3>Business Listings</h3>
// //           {/* Display filtered businesses here */}
// //           <input
// //             type="text"
// //             placeholder="Search businesses..."
// //             onChange={(e) => handleSearch(e.target.value)}
// //           />
// //           <div className="business-list">
// //             {filteredBusinesses.length === 0 ? (
// //               <p>No businesses found.</p>
// //             ) : (
// //               filteredBusinesses.map((business) => (
// //                 <div key={business.id}>
// //                   <h4>{business.name}</h4>
// //                   <button onClick={() => handleViewBusiness(business.id)}>View Business</button>
// //                 </div>
// //               ))
// //             )}
// //           </div>
// //         </div>
// //         {/* Map Section */}
// //         <div className="map-map-container">
// //           {position ? (
// //             <MapContainer
// //               center={position}
// //               zoom={15}
// //               style={{ height: '400px', width: '100%' }}
// //             >
// //               <TileLayer
// //                 url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
// //                 attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
// //               />
// //               <Marker
// //                 position={latLng}
// //                 draggable={false}
// //                 icon={new L.Icon({
// //                   iconUrl: require('leaflet/dist/images/marker-icon.png'),
// //                   iconSize: [25, 41],
// //                   iconAnchor: [12, 41],
// //                   popupAnchor: [0, -41],
// //                 })}
// //               >
// //                 <Popup>{address ? `Address: ${address}` : 'Locating...'}</Popup>
// //               </Marker>
// //               {/* Map Businesses */}
// //               {filteredBusinesses.map((business) => (
// //                 <Marker
// //                   key={business.id}
// //                   position={[business.address.latitude, business.address.longitude]}
// //                   icon={new L.Icon({
// //                     iconUrl: require('leaflet/dist/images/marker-icon.png'),
// //                     iconSize: [25, 41],
// //                     iconAnchor: [12, 41],
// //                     popupAnchor: [0, -41],
// //                   })}
// //                   eventHandlers={{
// //                     click: () => handleBusinessClick(business),
// //                   }}
// //                 >
// //                   <Popup>
// //                     <strong>{business.name}</strong>
// //                     <br />
// //                     {business.contactNo}
// //                     <br />
// //                     Lat: {business.address.latitude} Long: {business.address.longitude}
// //                     <br />
// //                     <div style={{ flexDirection: 'row' }}>
// //                       <button onClick={handleGetDirections}>Get Directions</button>
// //                       <button onClick={() => { handleViewBusiness(business.id); }}>View Business</button>
// //                     </div>
// //                   </Popup>
// //                 </Marker>
// //               ))}
// //               {/* Polyline for the route */}
// //               {showRoute && route.length > 0 && <Polyline positions={route} color="blue" />}
// //             </MapContainer>
// //           ) : (
// //             <div>Loading your location...</div>
// //           )}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default MapLayout;







// // import React, { useState, useEffect } from 'react';
// // import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
// // import { useNavigate } from "react-router-dom";
// // import L from 'leaflet';
// // import 'leaflet/dist/leaflet.css';
// // import axios from 'axios';
// // import './MapLayout.css';

// // const MapLayout = () => {
// //   const [position, setPosition] = useState(null); // User's position
// //   const [address, setAddress] = useState('');
// //   const [latLng, setLatLng] = useState({ lat: null, lng: null });
// //   const [businesses, setBusinesses] = useState([]); // Business data
// //   const [route, setRoute] = useState([]); // Store route coordinates
// //   const [directions, setDirections] = useState([]); // Store turn-by-turn directions
// //   const [selectedBusiness, setSelectedBusiness] = useState(null); // Store selected business for directions
// //   const [showRoute, setShowRoute] = useState(false); // Control visibility of route
// //   const [userRoute, setUserRoute] = useState([]); // To track user's movement
// //   const navigate = useNavigate();
// //   const indiaBounds = [
// //     [6.5546079, 68.1113787], // South-West point
// //     [35.6745457, 97.395561], // North-East point
// //   ]; // Approximate bounds for India

// //   const apiKey = '5b3ce3597851110001cf624837ef2e934b8a496abc433f8914da963e'; // Replace with your OpenRouteService API key

// //   // Get user's current location
// //   useEffect(() => {

// //     const askForLocation = () => {
// //       if (navigator.geolocation) {
// //         navigator.geolocation.watchPosition(
// //           (pos) => {
// //             const userPosition = [pos.coords.latitude, pos.coords.longitude];
// //             setPosition(userPosition);
// //             setLatLng({ lat: pos.coords.latitude, lng: pos.coords.longitude });
// //             fetchAddress(pos.coords.latitude, pos.coords.longitude);
// //             updateUserRoute(userPosition); // Track the user's movement
// //           },
// //           () => {
// //             alert("Unable to retrieve your location.");
// //           },
// //           {
// //             enableHighAccuracy: true,
// //             maximumAge: 10000,
// //             timeout: 5000,
// //           }
// //         );
// //       } else {
// //         alert("Geolocation is not supported by this browser.");
// //       }
// //     };

// //     askForLocation();
// //   }, []);

// //   // Fetch address using reverse geocoding
// //   const fetchAddress = async (lat, lng) => {
// //     try {
// //       const response = await axios.get(
// //         `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
// //       );
// //       setAddress(response.data.display_name);
// //     } catch (error) {
// //       console.error("Error fetching address:", error);
// //     }
// //   };

// //   // Fetch businesses data
// //   const fetchBusinesses = async () => {
// //     try {
// //       const response = await axios.get('http://localhost:5196/api/Business/All'); // Replace with your actual API endpoint
// //       setBusinesses(response.data);
// //     } catch (error) {
// //       console.error("Error fetching businesses:", error);
// //     }
// //   };

// //   useEffect(() => {
// //     fetchBusinesses(); // Fetch businesses data when the component mounts
// //   }, []);

// //   // Fetch turn-by-turn directions
// //   const fetchDirections = async (startLat, startLng, endLat, endLng) => {
// //     const url = 'https://api.openrouteservice.org/v2/directions/driving-car';

// //     try {
// //       const response = await axios.get(url, {
// //         params: {
// //           start: `${startLng},${startLat}`, // Format as 'longitude,latitude'
// //           end: `${endLng},${endLat}`, // Format as 'longitude,latitude'
// //         },
// //         headers: {
// //           Authorization: apiKey, // API key for OpenRouteService
// //         },
// //       });

// //       if (response.data.features && response.data.features.length > 0) {
// //         const coordinates = response.data.features[0].geometry.coordinates;
// //         const directions = response.data.features[0].properties.segments[0].steps;

// //         // Convert to Leaflet-friendly [lat, lng] format
// //         const leafletCoordinates = coordinates.map(([lng, lat]) => [lat, lng]);
// //         setRoute(leafletCoordinates); // Set route
// //         setDirections(directions); // Set directions (step-by-step)
// //         setShowRoute(true); // Show the route on the map
// //       } else {
// //         alert('No route found.');
// //       }
// //     } catch (error) {
// //       console.error('Error fetching directions:', error);
// //       alert('Unable to fetch directions. Please try again.');
// //     }
// //   };

// //   // Update the user's route based on their current position
// //   const updateUserRoute = (newPosition) => {
// //     if (selectedBusiness) {
// //       const startLat = newPosition[0];
// //       const startLng = newPosition[1];
// //       const endLat = selectedBusiness.address.latitude;
// //       const endLng = selectedBusiness.address.longitude;
// //       fetchDirections(startLat, startLng, endLat, endLng); // Re-fetch directions based on current position
// //     }
// //   };

// //   // Handle business click to show directions
// //   const handleBusinessClick = (business) => {
// //     setSelectedBusiness(business);
// //     setRoute([]); // Clear previous route
// //     setShowRoute(false); // Hide previous route
// //     setDirections([]); // Clear directions
// //   };

// //   // Handle "Get Directions" button click
// //   const handleGetDirections = () => {
// //     if (selectedBusiness) {
// //       fetchDirections(
// //         latLng.lat,
// //         latLng.lng,
// //         selectedBusiness.address.latitude,
// //         selectedBusiness.address.longitude
// //       );
// //     }
// //   };

// //   const handleViewBusiness = (businessId) => {
// //     navigate(`/ViewBusinessService/${businessId}`);
// //   };

// //   return (
// //     <div className="map-container">
// //       <div className="map-main-content">
// //         {/* Map Section */}
// //         <div className="map-map-container">
// //           {position ? (
// //             <MapContainer
// //               center={position}
// //               zoom={15}
// //               style={{ height: '400px', width: '100%' }}
// //             >
// //               <TileLayer
// //                 url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
// //                 attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
// //               />
// //               <Marker
// //                 position={latLng}
// //                 draggable={false}
// //                 icon={new L.Icon({
// //                   iconUrl: require('leaflet/dist/images/marker-icon.png'),
// //                   iconSize: [25, 41],
// //                   iconAnchor: [12, 41],
// //                   popupAnchor: [0, -41],
// //                 })}
// //               >
// //                 <Popup>{address ? `Address: ${address}` : 'Locating...'}</Popup>
// //               </Marker>
// //               {/* Map Businesses */}
// //               {businesses.map((business) => (
// //                 <Marker
// //                   key={business.id}
// //                   position={[business.address.latitude, business.address.longitude]}
// //                   icon={new L.Icon({
// //                     iconUrl: require('leaflet/dist/images/marker-icon.png'),
// //                     iconSize: [25, 41],
// //                     iconAnchor: [12, 41],
// //                     popupAnchor: [0, -41],
// //                   })}
// //                   eventHandlers={{
// //                     click: () => handleBusinessClick(business),
// //                   }}
// //                 >
// //                   <Popup>
// //                     <strong>{business.name}</strong>
// //                     <br />
// //                     {business.contactNo}
// //                     <br />
// //                     Lat: {business.address.latitude} Long: {business.address.longitude}
// //                     <br />
// //                     <div style={{ flexDirection: 'row' }}>
// //                       <button onClick={handleGetDirections}>Get Directions</button>
// //                       <button onClick={()=>{handleViewBusiness(business.id)}}>View Business</button>
// //                     </div>
// //                   </Popup>
// //                 </Marker>
// //               ))}
// //               {/* Polyline for the route */}
// //               {showRoute && route.length > 0 && <Polyline positions={route} color="blue" />}
// //             </MapContainer>
// //           ) : (
// //             <div>Loading your location...</div>
// //           )}
// //         </div>

// //         {/* Right Content */}
// //         <div className="right-content">
// //           <h3>Business Listings</h3>
// //           <ul>
// //             {/* Directions Section */}
// //             {/* {directions.length > 0 && (
// //           <div className="directions-container">
// //             <h3>Directions</h3>
// //             <ol>
// //               {directions.map((step, index) => (
// //                 <li key={index}>{step.instruction}</li>
// //               ))}
// //             </ol>
// //           </div>
// //         )}  */}

// //             {/* {businesses.map((business) => (
// //               <li key={business.id}>
// //                 <strong>{business.name}</strong>
// //                 <br />
// //                 {business.description}
// //               </li>
// //             ))} */}
// //           </ul>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default MapLayout;


// // import React, { useState, useEffect } from 'react';
// // import { useNavigate } from "react-router-dom";
// // import { MapContainer, TileLayer, Marker, Popup, useMapEvent } from 'react-leaflet';
// // import L from 'leaflet'; // Import Leaflet to access the icon
// // import 'leaflet/dist/leaflet.css';
// // import axios from 'axios';
// // import './MapLayout.css';


// // const MapLayout = () => {
// //   const defaultPosition = [20.5937, 78.9629]; // Default position in India (center)
// //   const indiaBounds = [
// //     [6.5546079, 68.1113787], // South-West point
// //     [35.6745457, 97.395561], // North-East point
// //   ]; // Approximate bounds for India

// //   const [position, setPosition] = useState(defaultPosition);
// //   const [address, setAddress] = useState('');
// //   const [latLng, setLatLng] = useState({ lat: defaultPosition[0], lng: defaultPosition[1] });
// //   const [map, setMap] = useState(null);
// //   const [businesses, setBusinesses] = useState([]);
// //   const navigate = useNavigate();

// //   useEffect(() => {
// //     if (navigator.geolocation) {
// //       navigator.geolocation.getCurrentPosition(
// //         (pos) => {
// //           const userPosition = [pos.coords.latitude, pos.coords.longitude];
// //           setPosition(userPosition);
// //           setLatLng({ lat: pos.coords.latitude, lng: pos.coords.longitude });
// //           fetchAddress(pos.coords.latitude, pos.coords.longitude);
// //         },
// //         () => {
// //           alert('Unable to retrieve your location. Showing default position.');
// //           setPosition(defaultPosition);
// //           setLatLng({ lat: defaultPosition[0], lng: defaultPosition[1] });
// //           fetchAddress(defaultPosition[0], defaultPosition[1]);
// //         }
// //       );
// //     } else {
// //       alert('Geolocation is not supported by this browser.');
// //     }
// //   }, []);

// //   const fetchAddress = async (lat, lng) => {
// //     try {
// //       const response = await axios.get(
// //         `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
// //       );
// //       setAddress(response.data.display_name);
// //     } catch (error) {
// //       console.error('Error fetching address:', error);
// //     }
// //   };

// //   const fetchBusinesses = async () => {
// //     try {
// //       const response = await axios.get('http://localhost:5196/api/Business/All');
// //       setBusinesses(response.data);
// //     } catch (error) {
// //       console.error('Error fetching businesses:', error);
// //     }
// //   };

// //   useEffect(() => {
// //     fetchBusinesses();
// //   }, []);

// //   const MapEvents = () => {
// //     useMapEvent('moveend', (event) => {
// //       const { lat, lng } = event.target.getCenter();
// //       setLatLng({ lat, lng });
// //       fetchAddress(lat, lng);
// //     });
// //     return null;
// //   };

// //   const handleDoubleClick = (businessId) => {
// //     alert(businessId);
// //     navigate(`/ViewBusinessService/${businessId}`);
// //   };

// //   return (
// //     <div style={{ marginTop: 20 }}>
// //       <MapContainer
// //         center={position}
// //         zoom={6} // Suitable zoom for India
// //         minZoom={5} // Prevent zooming out too much
// //         maxZoom={15} // Set a reasonable max zoom
// //         maxBounds={indiaBounds} // Restrict map to India's bounds
// //         style={{ height: '500px', width: '100%' }}
// //         whenCreated={(map) => setMap(map)}
// //       >
// //         <TileLayer
// //           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
// //           attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
// //         />

// //         {/* User Marker */}
// //         <Marker
// //           position={latLng}
// //           icon={new L.Icon({
// //             iconUrl: require('leaflet/dist/images/marker-icon.png'),
// //             iconSize: [25, 41],
// //             iconAnchor: [12, 41],
// //             popupAnchor: [0, -41],
// //           })}
// //         >
// //           <Popup>{address ? `Address : ${address}` : 'Locating...'}</Popup>
// //         </Marker>

// //         {/* Business Markers */}
// //         {businesses.map((business) => (
// //           <Marker
// //             key={business.id}
// //             position={[business.address.latitude, business.address.longitude]}
// //             icon={new L.Icon({
// //               iconUrl: require('leaflet/dist/images/marker-icon.png'),
// //               iconSize: [25, 41],
// //               iconAnchor: [12, 41],
// //               popupAnchor: [0, -41],
// //             })}
// //             eventHandlers={{
// //               dblclick: () => handleDoubleClick(business.id),
// //             }}
// //           >
// //             <Popup>
// //               <strong>{business.name}</strong>
// //               <br />
// //               {business.description}
// //               <br />
// //               Contact: {business.contactNo}
// //             </Popup>
// //           </Marker>
// //         ))}

// //         <MapEvents />
// //       </MapContainer>
// //       <div className="map-info">
// //         <h3>Current Location Information:</h3>
// //         <p>Latitude: {latLng.lat}</p>
// //         <p>Longitude: {latLng.lng}</p>
// //         <p>Address: {address}</p>
// //       </div>
// //     </div>
// //   );
// // };

// // export default MapLayout;




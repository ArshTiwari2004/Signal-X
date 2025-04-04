import React, { useEffect, useRef, useState } from "react";
import { mappls } from "mappls-web-maps";
import { MapPin, Navigation, AlertTriangle, Crosshair, Car, AlertCircle } from "lucide-react";

const mapplsClassObject = new mappls();

// Alert icons based on type - using danger signs
const getAlertIcon = (type) => {
  switch (type) {
    case "accident":
      return "https://uploads-ssl.webflow.com/60bfad069fcc9b4dc065dae6/60f6caaf9e8f0991dc7a4c0d_crash-accident-icon.svg";
    case "roadblock":
      return "https://cdn-icons-png.flaticon.com/512/5735/5735290.png";
    case "trafficJam":
      return "https://cdn-icons-png.flaticon.com/512/2780/2780146.png";
    default:
      return "https://cdn-icons-png.flaticon.com/512/2354/2354573.png";
  }
};

// API endpoint for fetching alerts
const ALERTS_API_ENDPOINT = "https://your-backend-api.com/traffic-alerts";

const TrafficMap = () => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [showCurrentLocation, setShowCurrentLocation] = useState(true);
  const [showAlerts, setShowAlerts] = useState(true);
  const [alertsData, setAlertsData] = useState([]);
  const [alertsCount, setAlertsCount] = useState(0);
  const alertMarkersRef = useRef([]);
  const alertInfoWindowRef = useRef(null);
  const heatmapLayerRef = useRef(null);
  const locationMarkerRef = useRef(null);
  const trafficDotsRef = useRef([]);

  // Function to fetch alerts from API - now using current location
  const fetchAlerts = async () => {
    try {
      // In a real application, use the actual API with current location parameters
      // const response = await fetch(`${ALERTS_API_ENDPOINT}?lat=${currentLocation.lat}&lng=${currentLocation.lng}`);
      // const data = await response.json();
      
      if (!currentLocation) return;
      
      // Using sample data around the current location
      const generateAlertsAroundLocation = (location) => {
        // Generate random offsets within 0.01 degrees (roughly 1km)
        const getRandomOffset = () => (Math.random() - 0.5) * 0.02;
        
        return [
          {
            id: 1,
            type: "accident",
            location: { lat: location.lat + getRandomOffset(), lng: location.lng + getRandomOffset() },
            severity: "high",
            timestamp: new Date().toISOString(),
            description: "Multi-vehicle collision reported",
            status: "active",
            details: {
              reportedBy: "Traffic Police",
              vehiclesInvolved: 3,
              injuries: "Minor",
              estimatedClearTime: "30 minutes",
              affectedLanes: "2 out of 3"
            }
          },
          {
            id: 2,
            type: "roadblock",
            location: { lat: location.lat + getRandomOffset(), lng: location.lng + getRandomOffset() },
            severity: "medium",
            timestamp: new Date().toISOString(),
            description: "Temporary road closure due to construction",
            status: "active",
            details: {
              reportedBy: "Municipal Corporation",
              startTime: "08:00 AM",
              endTime: "6:00 PM",
              alternateRoutes: "Available",
              estimatedDelay: "15 minutes"
            }
          },
          {
            id: 3,
            type: "trafficJam",
            location: { lat: location.lat + getRandomOffset(), lng: location.lng + getRandomOffset() },
            severity: "medium",
            timestamp: new Date().toISOString(),
            description: "Heavy traffic congestion",
            status: "active",
            details: {
              length: "1.5 km",
              averageSpeed: "5 km/h",
              estimatedClearTime: "45 minutes",
              cause: "High volume"
            }
          }
        ];
      };
      
      const data = generateAlertsAroundLocation(currentLocation);
      
      setAlertsData(data);
      setAlertsCount(data.length);
      
      // Update alert markers on the map
      updateAlertMarkers(data);
    } catch (error) {
      console.error("Error fetching alerts:", error);
    }
  };
  
  // Get current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ lat: latitude, lng: longitude });
        },
        (err) => {
          console.error("Geolocation error:", err);
          // Fallback to a default location (Delhi)
          setCurrentLocation({ lat: 28.612964, lng: 77.229463 });
        },
        { enableHighAccuracy: true }
      );
    } else {
      // Fallback to a default location
      setCurrentLocation({ lat: 28.612964, lng: 77.229463 });
    }
  }, []);

  // Initialize map when component mounts
  useEffect(() => {
    const loadObject = {
      map: true,
      layer: "raster",
      version: "3.0",
    };

    mapplsClassObject.initialize(import.meta.env.VITE_MAPPLS_SDK_KEY, loadObject, () => {
      if (mapRef.current) {
        mapRef.current.remove();
      }

      // Create map with default center (will be updated once we have current location)
      const newMap = mapplsClassObject.Map({
        id: "map",
        properties: {
          center: [28.612964, 77.229463],
          zoom: 12,
        },
      });

      newMap.on("load", () => {
        setIsMapLoaded(true);
        console.log("Map loaded successfully");
        mapInstance.current = newMap;
        
        // We'll fetch alerts after location is set
      });

      mapRef.current = newMap;
    });

    // Clean up on unmount
    return () => {
      if (mapRef.current) {
        clearAllMapLayers();
        mapRef.current.remove();
      }
    };
  }, []);

  // Helper function to clear all map layers
  const clearAllMapLayers = () => {
    // Clear alert markers
    if (alertMarkersRef.current.length > 0) {
      alertMarkersRef.current.forEach(marker => {
        mapplsClassObject.removeLayer({ map: mapInstance.current, layer: marker });
      });
      alertMarkersRef.current = [];
    }
    
    // Clear info window
    if (alertInfoWindowRef.current) {
      mapplsClassObject.removeLayer({ map: mapInstance.current, layer: alertInfoWindowRef.current });
      alertInfoWindowRef.current = null;
    }
    
    // Clear heatmap
    if (heatmapLayerRef.current) {
      mapplsClassObject.removeLayer({ map: mapInstance.current, layer: heatmapLayerRef.current });
      heatmapLayerRef.current = null;
    }
    
    // Clear location marker
    if (locationMarkerRef.current) {
      mapplsClassObject.removeLayer({ map: mapInstance.current, layer: locationMarkerRef.current });
      locationMarkerRef.current = null;
    }
    
    // Clear traffic dots
    if (trafficDotsRef.current.length > 0) {
      trafficDotsRef.current.forEach(dot => {
        mapplsClassObject.removeLayer({ map: mapInstance.current, layer: dot });
      });
      trafficDotsRef.current = [];
    }
  };

  // Update traffic heatmap when current location changes
  useEffect(() => {
    if (!isMapLoaded || !mapInstance.current || !currentLocation) return;
    
    // Center map on current location
    mapInstance.current.setCenter(currentLocation);
    mapInstance.current.setZoom(14);
    
    // Clear existing heatmap
    if (heatmapLayerRef.current) {
      mapplsClassObject.removeLayer({ map: mapInstance.current, layer: heatmapLayerRef.current });
      heatmapLayerRef.current = null;
    }
    
    // Generate traffic congestion data around current location
    const trafficData = generateTrafficDataAroundLocation(currentLocation);
    
    // Create heatmap layer
    heatmapLayerRef.current = mapplsClassObject.HeatmapLayer({
      map: mapInstance.current,
      data: trafficData,
      opacity: 0.7,
      radius: 15,
      maxIntensity: 10,
      gradient: [
        "rgba(0, 255, 0, 0)",
        "rgba(0, 255, 0, 1)",
        "rgba(255, 255, 0, 1)",
        "rgba(255, 0, 0, 1)",
      ],
    });
    
    // Add traffic congestion dots
    addTrafficCongestionDots(trafficData);
    
    // Add current location marker
    updateLocationMarker();
    
    // Now fetch alerts based on current location
    fetchAlerts();
  }, [isMapLoaded, currentLocation]);

  // Generate traffic data around current location
  const generateTrafficDataAroundLocation = (location) => {
    const trafficData = [];
    const radius = 0.01; // Roughly 1km
    
    // Generate 30 points with varying intensity
    for (let i = 0; i < 30; i++) {
      // Random offset within radius
      const latOffset = (Math.random() - 0.5) * 2 * radius;
      const lngOffset = (Math.random() - 0.5) * 2 * radius;
      
      trafficData.push({
        lat: location.lat + latOffset,
        lng: location.lng + lngOffset,
        weight: Math.random() * 10 // Random weight for intensity
      });
    }
    
    return trafficData;
  };

  // Add traffic congestion dots to visualize congestion
  const addTrafficCongestionDots = (trafficData) => {
    // Clear existing dots
    if (trafficDotsRef.current.length > 0) {
      trafficDotsRef.current.forEach(dot => {
        mapplsClassObject.removeLayer({ map: mapInstance.current, layer: dot });
      });
      trafficDotsRef.current = [];
    }
    
    // Only show dots for high congestion areas (weight > 7)
    const highCongestionPoints = trafficData.filter(point => point.weight > 7);
    
    trafficDotsRef.current = highCongestionPoints.map(point => {
      return mapplsClassObject.Marker({
        map: mapInstance.current,
        position: { lat: point.lat, lng: point.lng },
        icon: {
          url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
          size: [15, 15], // Smaller than alert icons
        },
        zIndex: 200, // Below alerts but above map
      });
    });
  };

  // Update current location marker
  const updateLocationMarker = () => {
    if (!mapInstance.current || !currentLocation || !showCurrentLocation) return;
    
    // Remove existing marker
    if (locationMarkerRef.current) {
      mapplsClassObject.removeLayer({ map: mapInstance.current, layer: locationMarkerRef.current });
      locationMarkerRef.current = null;
    }
    
    // Add new marker
    locationMarkerRef.current = mapplsClassObject.Marker({
        map: mapInstance.current,
        position: currentLocation,
        icon: {
          url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
          size: [40, 40],
        },
        popupHtml: "<div><strong style=\"color: black;\">You are here</strong></div>",
        popupOptions: {
          openPopup: true,
          autoClose: false,
          maxWidth: 200
        },
        zIndex: 1000,  
      });
  };

  // Update alert markers on the map
  const updateAlertMarkers = (alerts) => {
    if (!mapInstance.current || !showAlerts) return;
    
    // Remove existing markers
    if (alertMarkersRef.current.length > 0) {
      alertMarkersRef.current.forEach(marker => {
        mapplsClassObject.removeLayer({ map: mapInstance.current, layer: marker });
      });
      alertMarkersRef.current = [];
    }
    
    // Add new markers
    alertMarkersRef.current = alerts.map(alert => {
      const marker = mapplsClassObject.Marker({
        map: mapInstance.current,
        position: alert.location,
        icon: {
          url: getAlertIcon(alert.type), // Using danger signs for alerts
          size: [35, 35],
        },
        draggable: false,
        zIndex: 500,
      });

      // Add click event to show alert details
      marker.on('click', () => {
        // Remove existing info window if open
        if (alertInfoWindowRef.current) {
          mapplsClassObject.removeLayer({ map: mapInstance.current, layer: alertInfoWindowRef.current });
        }

        // Create info window with alert details
        const alertDetailsHTML = `
          <div style="padding: 10px; max-width: 300px;">
            <h3 style="margin: 0 0 8px; color: ${
              alert.severity === 'high' ? '#e53e3e' : 
              alert.severity === 'medium' ? '#dd6b20' : '#38a169'
            }; font-weight: bold;">${
              alert.type.charAt(0).toUpperCase() + alert.type.slice(1)
            } Alert</h3>
            <p style="margin: 0 0 5px;"><strong>Description:</strong> ${alert.description}</p>
            <p style="margin: 0 0 5px;"><strong>Severity:</strong> ${alert.severity}</p>
            <p style="margin: 0 0 5px;"><strong>Reported:</strong> ${new Date(alert.timestamp).toLocaleTimeString()}</p>
            
            <div style="margin-top: 10px; border-top: 1px solid #ddd; padding-top: 10px;">
              <h4 style="margin: 0 0 8px;">Details:</h4>
              ${Object.entries(alert.details).map(([key, value]) => 
                `<p style="margin: 0 0 5px;"><strong>${
                  key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())
                }:</strong> ${value}</p>`
              ).join('')}
            </div>
          </div>
        `;

        alertInfoWindowRef.current = mapplsClassObject.InfoWindow({
          map: mapInstance.current,
          position: alert.location,
          content: alertDetailsHTML,
          maxWidth: 320
        });
      });

      return marker;
    });
  };

  // Effect to update map components when visibility toggles change
  useEffect(() => {
    if (!isMapLoaded || !mapInstance.current) return;
    
    // Update location marker
    if (showCurrentLocation) {
      updateLocationMarker();
    } else if (locationMarkerRef.current) {
      mapplsClassObject.removeLayer({ map: mapInstance.current, layer: locationMarkerRef.current });
      locationMarkerRef.current = null;
    }
    
    // Update alert markers
    if (showAlerts) {
      updateAlertMarkers(alertsData);
    } else if (alertMarkersRef.current.length > 0) {
      alertMarkersRef.current.forEach(marker => {
        mapplsClassObject.removeLayer({ map: mapInstance.current, layer: marker });
      });
      alertMarkersRef.current = [];
      
      // Close info window if open
      if (alertInfoWindowRef.current) {
        mapplsClassObject.removeLayer({ map: mapInstance.current, layer: alertInfoWindowRef.current });
        alertInfoWindowRef.current = null;
      }
    }
  }, [showCurrentLocation, showAlerts, isMapLoaded]);

  // Set up periodic refresh of alerts
  useEffect(() => {
    if (!isMapLoaded || !currentLocation) return;
    
    // Initial fetch
    fetchAlerts();
    
    // Set up interval (every 30 seconds)
    const intervalId = setInterval(fetchAlerts, 30000);
    
    return () => clearInterval(intervalId);
  }, [isMapLoaded, currentLocation]);

  // Handle clicking on an alert in the sidebar
  const handleAlertClick = (alert) => {
    if (!mapInstance.current || !isMapLoaded) return;
    
    // Center map on alert location
    mapInstance.current.setCenter(alert.location);
    mapInstance.current.setZoom(15);
    
    // Find the marker for this alert
    const alertMarker = alertMarkersRef.current.find(
      marker => 
        marker._position.lat === alert.location.lat && 
        marker._position.lng === alert.location.lng
    );
    
    // Trigger click event if marker found
    if (alertMarker) {
      mapplsClassObject.trigger(alertMarker, 'click');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Traffic Map</h2>
        <div className="flex gap-4">
          <button 
            className={`${showCurrentLocation ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'} px-4 py-2 rounded-lg flex items-center gap-2`}
            onClick={() => setShowCurrentLocation(!showCurrentLocation)}
          >
            <Crosshair className="w-4 h-4" />
            <span>{showCurrentLocation ? 'Current Location On' : 'Show My Location'}</span>
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg flex items-center gap-2">
            <Navigation className="w-4 h-4" />
            <span>Route Optimization</span>
          </button>
          <button 
            className={`${showAlerts ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-700 hover:bg-gray-600'} px-4 py-2 rounded-lg flex items-center gap-2`}
            onClick={() => setShowAlerts(!showAlerts)}
          >
            <AlertTriangle className="w-4 h-4" />
            <span>
              {showAlerts ? 'Hide Alerts' : 'Show Alerts'} 
              {alertsCount > 0 && <span className="ml-1 bg-red-500 text-white rounded-full px-2 py-1 text-xs">{alertsCount}</span>}
            </span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-gray-800 rounded-xl p-6 relative">
          <div id="map" style={{ width: "100%", height: "500px" }}></div>
        </div>
        
        {/* Active Alerts Panel */}
        <div className="bg-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Active Alerts</h3>
            <span className="bg-red-500 text-white rounded-full px-2 py-1 text-xs">{alertsCount} Active</span>
          </div>
          
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {alertsData.map((alert) => (
              <div 
                key={alert.id} 
                className={`bg-gray-700 p-4 rounded-lg border-l-4 ${
                  alert.severity === 'high' ? 'border-red-500' : 
                  alert.severity === 'medium' ? 'border-orange-500' : 'border-green-500'
                } cursor-pointer hover:bg-gray-600`}
                onClick={() => handleAlertClick(alert)}
              >
                <div className="flex items-center gap-3 mb-2">
                  {alert.type === 'accident' ? (
                    <Car className="w-5 h-5 text-red-500" />
                  ) : alert.type === 'roadblock' ? (
                    <AlertCircle className="w-5 h-5 text-orange-500" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-yellow-500" />
                  )}
                  <span className="font-medium">
                    {alert.type.charAt(0).toUpperCase() + alert.type.slice(1)}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    alert.severity === 'high' ? 'bg-red-900 text-red-200' : 
                    alert.severity === 'medium' ? 'bg-orange-900 text-orange-200' : 'bg-green-900 text-green-200'
                  }`}>
                    {alert.severity.toUpperCase()}
                  </span>
                </div>
                <p className="text-sm mb-2">{alert.description}</p>
                <div className="flex justify-between text-xs text-gray-400">
                  <span>Reported: {new Date(alert.timestamp).toLocaleTimeString()}</span>
                  <button 
                    className="text-blue-400 hover:text-blue-300"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAlertClick(alert);
                    }}
                  >
                    View on Map
                  </button>
                </div>
              </div>
            ))}
            
            {alertsData.length === 0 && (
              <div className="bg-gray-700 p-4 rounded-lg text-center">
                <p className="text-gray-400">No active alerts</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Traffic Density Analysis</h3>
          <div className="space-y-4">
            {["High", "Medium", "Low"].map((density) => (
              <div key={density} className="flex items-center justify-between bg-gray-700 p-4 rounded-lg">
                <div className="flex items-center gap-3">
                  <MapPin
                    className={`w-5 h-5 ${
                      density === "High" ? "text-red-500" : density === "Medium" ? "text-yellow-500" : "text-green-500"
                    }`}
                  />
                  <span>{density} Density Areas</span>
                </div>
                <span className="font-semibold">
                  {density === "High" ? "5" : density === "Medium" ? "8" : "12"}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Alternative Routes</h3>
          <div className="space-y-3">
            {[
              { from: "Current Location", to: "Business District", time: "15 mins" },
              { from: "Current Location", to: "Shopping Mall", time: "12 mins" },
              { from: "Current Location", to: "Industrial Zone", time: "20 mins" },
            ].map((route, index) => (
              <div key={index} className="bg-gray-700 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">{route.from}</span>
                  <span className="text-blue-400">→</span>
                  <span className="font-medium">{route.to}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-400">
                  <span>Alternative Route Available</span>
                  <span>{route.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrafficMap;
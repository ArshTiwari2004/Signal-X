import { useState, useEffect } from 'react';

export default function TrafficResults() {
  const [detections, setDetections] = useState([]);
  const [isActive, setIsActive] = useState(false);
  const [emergencyMode, setEmergencyMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [videosLoaded, setVideosLoaded] = useState(false);
  const [location, setLocation] = useState({
    name: "Delhi",
    coords: { lat: 28.6139, lng: 77.2090 }
  });

  // Video paths (assuming they are in the public/videos folder)
  const laneVideos = [
    { id: 1, src: "/data/lane1.mp4", title: "Lane 1 being processed" },
    { id: 2, src: "/data/lane2.mp4", title: "Lane 2 being processed" },
    { id: 3, src: "/data/lane3.mp4", title: "Lane 3 being processed" },
    { id: 4, src: "/data/lane4.mp4", title: "Lane 4 being processed" }
  ];

  // OpenStreetMap static image URL
  const getOpenStreetMapUrl = (lat, lng, zoom = 14) => {
    return `https://staticmap.openstreetmap.de/staticmap.php?center=${lat},${lng}&zoom=${zoom}&size=400x300&maptype=mapnik`;
  };

  // Set traffic map based on location
  useEffect(() => {
    const mapUrl = getOpenStreetMapUrl(location.coords.lat, location.coords.lng);
    document.getElementById('trafficMap')?.setAttribute('src', mapUrl);
  }, [location]);

  // Vehicle detection simulation
  useEffect(() => {
    if (!isActive) {
      setVideosLoaded(false);
      return;
    }
    
    setLoading(true);
    
    // Simulate loading videos
    setTimeout(() => {
      setLoading(false);
      setVideosLoaded(true);
      
      // Initial detection
      setDetections([
        {
          id: 1,
          type: 'AMBULANCE',
          confidence: 92,
          lane: 1,
          timestamp: new Date().toISOString(),
          position: { x: 120, y: 80, width: 200, height: 150 }
        },
        {
          id: 2,
          type: 'TRUCK',
          confidence: 85,
          lane: 3,
          timestamp: new Date().toISOString(),
          position: { x: 80, y: 60, width: 180, height: 140 }
        }
      ]);
      
      // Set emergency mode for ambulance
      setEmergencyMode(true);
    }, 2000);
    
    // Continuous simulation
    const simulationInterval = setInterval(() => {
      // Generate random detection data
      const vehicleTypes = ['CAR', 'TRUCK', 'BUS', 'AMBULANCE'];
      const randomType = vehicleTypes[Math.floor(Math.random() * vehicleTypes.length)];
      const randomConfidence = Math.floor(85 + Math.random() * 15);
      const randomLane = Math.floor(Math.random() * 4) + 1;
      
      // Create new detection
      const newDetection = {
        id: Date.now(),
        type: randomType,
        confidence: randomConfidence,
        lane: randomLane,
        timestamp: new Date().toISOString(),
        position: { x: 100 + Math.random() * 100, y: 50 + Math.random() * 100, width: 180, height: 140 }
      };
      
      // Update detections list
      setDetections(prev => [newDetection, ...prev.slice(0, 5)]);
      
      // Set emergency mode if ambulance is detected
      if (randomType === 'AMBULANCE') {
        setEmergencyMode(true);
      } else if (Math.random() > 0.9) {
        // Occasionally turn off emergency mode to simulate ambulance passing
        setEmergencyMode(false);
      }
    }, 3000);
    
    return () => {
      clearInterval(simulationInterval);
      setEmergencyMode(false);
    };
  }, [isActive]);

  return (
    <div className="bg-gray-100 p-4">
      {/* Header */}
      <header className="bg-white shadow rounded-lg p-4 mb-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">SignalX Traffic Control</h1>
          <div className="flex items-center space-x-4">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              emergencyMode 
                ? 'bg-red-100 text-red-800 animate-pulse' 
                : 'bg-green-100 text-green-800'
            }`}>
              {emergencyMode ? 'EMERGENCY MODE' : 'Normal Operation'}
            </span>
            <button
              onClick={() => setIsActive(!isActive)}
              className={`px-4 py-2 rounded-md text-white ${
                isActive ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'
              } transition-colors`}
            >
              {isActive ? 'Stop Monitoring' : 'Start Monitoring'}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Camera Feed */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow overflow-hidden">
          <div className="bg-gray-800 text-white p-3">
            <h2 className="font-semibold">Junction Camera Feed</h2>
          </div>
          <div className="p-4">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-[600px] bg-gray-200 rounded-lg">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
                <p className="text-gray-600">Initializing camera feeds...</p>
                <div className="w-full bg-gray-300 rounded-full h-1.5 mt-4 max-w-md">
                  <div className="bg-blue-600 h-1.5 rounded-full animate-progress" style={{width: '70%'}}></div>
                </div>
              </div>
            ) : videosLoaded ? (
              <div className="space-y-4">
              {laneVideos.map(video => (
                <div key={video.id} className="relative bg-black rounded-lg overflow-hidden">
                  <video 
                    src={video.src} 
                    autoPlay 
                    loop 
                    muted 
                    className="w-full h-80 object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white p-2 text-sm font-medium">
                    {video.title}
                  </div>
                </div>
              ))}
            </div>
            
            ) : (
              <div className="flex flex-col items-center justify-center h-[600px] bg-gray-200 rounded-lg">
                <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                </svg>
                <p className="text-gray-500 text-center">Camera feeds will appear when monitoring is started</p>
              </div>
            )}
          </div>
        </div>

        {/* Detection Panel */}
        <div className="space-y-4">
          {/* Emergency Alert */}
          {emergencyMode && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg animate-pulse">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Priority override active
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>
                      Green light extended for Lane {detections.find(d => d.type === 'AMBULANCE')?.lane || 1}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Detection Log */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="bg-gray-800 text-white p-3">
              <h2 className="font-semibold">Detection Log</h2>
            </div>
            <div className="divide-y divide-gray-200 max-h-64 overflow-y-auto">
              {detections.length > 0 ? (
                detections.map(detection => (
                  <div key={detection.id} className={`p-3 ${detection.type === 'AMBULANCE' ? 'bg-red-50' : ''}`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">
                          {detection.type} in Lane {detection.lane}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(detection.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        detection.type === 'AMBULANCE' 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {detection.confidence}% conf
                      </span>
                    </div>
                    <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          detection.type === 'AMBULANCE' ? 'bg-red-500' : 'bg-blue-500'
                        }`} 
                        style={{ width: `${detection.confidence}%` }}
                      ></div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-gray-500">
                  {isActive ? 'No vehicles detected' : 'System inactive'}
                </div>
              )}
            </div>
          </div>

          {/* System Controls */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="bg-gray-800 text-white p-3">
              <h2 className="font-semibold">Signal Controls</h2>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-4 gap-2 mb-4">
                {[1, 2, 3, 4].map(lane => (
                  <div key={lane} className="text-center">
                    <div className={`h-16 rounded-md flex items-center justify-center ${
                      emergencyMode && detections.find(d => d.type === 'AMBULANCE')?.lane === lane
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200'
                    }`}>
                      <span className="font-bold">Lane {lane}</span>
                    </div>
                  </div>
                ))}
              </div>
              <button 
                className={`w-full py-2 rounded-md text-white ${
                  emergencyMode ? 'bg-green-600' : 'bg-gray-400'
                }`}
                disabled={!emergencyMode}
              >
                {emergencyMode ? 'Priority Active' : 'Normal Operation'}
              </button>
            </div>
          </div>

          {/* Live Traffic Map Integration */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="bg-gray-800 text-white p-3">
              <div className="flex justify-between items-center">
                <h2 className="font-semibold">Live Traffic Map</h2>
                <select 
                  onChange={(e) => setLocation(JSON.parse(e.target.value))}
                  className="text-xs bg-gray-700 rounded px-2 py-1"
                >
                  <option value={JSON.stringify({name: "Delhi", coords: {lat: 28.6139, lng: 77.2090}})}>
                    Delhi
                  </option>
                  <option value={JSON.stringify({name: "Mumbai", coords: {lat: 19.0760, lng: 72.8777}})}>
                    Mumbai
                  </option>
                  <option value={JSON.stringify({name: "Bangalore", coords: {lat: 12.9716, lng: 77.5946}})}>
                    Bangalore
                  </option>
                </select>
              </div>
            </div>
            <div className="p-4">
              <div className="relative">
                <img 
                  id="trafficMap"
                  src={getOpenStreetMapUrl(location.coords.lat, location.coords.lng)}
                  alt="Traffic map"
                  className="w-full h-48 object-cover rounded border"
                />
                {loading && (
                  <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
                  </div>
                )}
              </div>
              <div className="mt-2">
                <p className="text-sm text-gray-600 text-center">
                  {location.name} Traffic • {new Date().toLocaleTimeString()}
                </p>
                <div className="flex justify-between text-xs mt-1">
                  <div className="flex items-center">
                    <span className="inline-block w-3 h-3 rounded-full bg-green-500 mr-1"></span>
                    <span>Light</span>
                  </div>
                  <div className="flex items-center">
                    <span className="inline-block w-3 h-3 rounded-full bg-yellow-500 mr-1"></span>
                    <span>Moderate</span>
                  </div>
                  <div className="flex items-center">
                    <span className="inline-block w-3 h-3 rounded-full bg-red-500 mr-1"></span>
                    <span>Heavy</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add some custom styles for the progress animation */}
      <style jsx>{`
        @keyframes progress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        .animate-progress {
          animation: progress 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
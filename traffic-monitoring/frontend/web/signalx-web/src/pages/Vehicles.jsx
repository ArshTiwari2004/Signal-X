import { useState, useEffect, useRef } from 'react';
import { RotateSpinner } from 'react-spinners-kit';

const Places = () => {
  const [selectedPlace, setSelectedPlace] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showProcessedVideo, setShowProcessedVideo] = useState(false);
  const [processingStep, setProcessingStep] = useState('');
  const videoRef = useRef(null);
  const processedVideoRef = useRef(null);
  const processingTimeoutRef = useRef(null);

  const places = [
    { value: '', label: 'Select a location' },
    { value: 'karolbagh', label: 'Karol Bagh Junction' },
    { value: 'saraikale', label: 'Sarai Kale Khan Junction' },
    { value: 'cp', label: 'Connaught Place' },
    { value: 'lajpatnagar', label: 'Lajpat Nagar' },
    { value: 'chandnichowk', label: 'Chandni Chowk' },
    { value: 'shimla', label: 'Shimla Mall Road' },
    { value: 'nehruplace', label: 'Nehru Place' },
    { value: 'dhaulaKuan', label: 'Dhaula Kuan' }
  ];

  const placeDetails = {
    karolbagh: {
      name: 'Karol Bagh Junction - Lane 1',
      rawVideo: '/videos/karolbagh.mp4',
      processedVideo: '/videos/karolbagh_detection.mp4',
      stats: {
        vehiclesDetected: 42,
        congestionLevel: 'High',
        avgSpeed: '12 km/h',
        emergencyVehicles: 1
      }
    },
    saraikale: {
      name: 'Sarai Kale Khan Junction - Main Road',
      rawVideo: '/videos/saraikale.mp4',
      processedVideo: '/videos/saraikale_detection.mp4',
      stats: {
        vehiclesDetected: 68,
        congestionLevel: 'Very High',
        avgSpeed: '8 km/h',
        emergencyVehicles: 2
      }
    },
    cp: {
      name: 'Connaught Place - Outer Circle',
      rawVideo: '/videos/cp.mp4',
      processedVideo: '/videos/cp_detection.mp4',
      stats: {
        vehiclesDetected: 35,
        congestionLevel: 'Medium',
        avgSpeed: '20 km/h',
        emergencyVehicles: 0
      }
    },
    lajpatnagar: {
      name: 'Lajpat Nagar - Central Market',
      rawVideo: '/videos/lajpatnagar.mp4',
      processedVideo: '/videos/lajpatnagar_detection.mp4',
      stats: {
        vehiclesDetected: 28,
        congestionLevel: 'Medium',
        avgSpeed: '18 km/h',
        emergencyVehicles: 1
      }
    },
    chandnichowk: {
      name: 'Chandni Chowk - Main Road',
      rawVideo: '/videos/chandnichowk.mp4',
      processedVideo: '/videos/chandnichowk_detection.mp4',
      stats: {
        vehiclesDetected: 75,
        congestionLevel: 'Extreme',
        avgSpeed: '5 km/h',
        emergencyVehicles: 1
      }
    },
    shimla: {
      name: 'Shimla - Mall Road',
      rawVideo: '/videos/shimla.mp4',
      processedVideo: '/videos/shimla_detection.mp4',
      stats: {
        vehiclesDetected: 15,
        congestionLevel: 'Low',
        avgSpeed: '25 km/h',
        emergencyVehicles: 0
      }
    },
    nehruplace: {
      name: 'Nehru Place - Main Junction',
      rawVideo: '/videos/nehruplace.mp4',
      processedVideo: '/videos/nehruplace_detection.mp4',
      stats: {
        vehiclesDetected: 48,
        congestionLevel: 'High',
        avgSpeed: '10 km/h',
        emergencyVehicles: 0
      }
    },
    dhaulaKuan: {
      name: 'Dhaula Kuan - Flyover',
      rawVideo: '/videos/dhaulaKuan.mp4',
      processedVideo: '/videos/dhaulaKuan_detection.mp4',
      stats: {
        vehiclesDetected: 32,
        congestionLevel: 'Medium',
        avgSpeed: '30 km/h',
        emergencyVehicles: 1
      }
    }
  };

  useEffect(() => {
    // Reset state when place changes
    setIsProcessing(false);
    setShowProcessedVideo(false);
    setProcessingStep('');
    clearTimeout(processingTimeoutRef.current);

    if (selectedPlace && videoRef.current) {
      videoRef.current.load();
    }
  }, [selectedPlace]);

  const handlePlaceChange = (e) => {
    setSelectedPlace(e.target.value);
  };

  const startProcessing = () => {
    if (!selectedPlace) return;

    setIsProcessing(true);
    setShowProcessedVideo(false);
    setProcessingStep('Initializing YOLOv8 model...');

    // Simulate processing steps
    processingTimeoutRef.current = setTimeout(() => {
      setProcessingStep('Analyzing traffic patterns...');
    }, 1500);

    processingTimeoutRef.current = setTimeout(() => {
      setProcessingStep('Detecting vehicles and pedestrians...');
    }, 3000);

    processingTimeoutRef.current = setTimeout(() => {
      setProcessingStep('Identifying emergency vehicles...');
    }, 4500);

    processingTimeoutRef.current = setTimeout(() => {
      setProcessingStep('Optimizing signal timings...');
    }, 6000);

    processingTimeoutRef.current = setTimeout(() => {
      setIsProcessing(false);
      setShowProcessedVideo(true);
      if (processedVideoRef.current) {
        processedVideoRef.current.load();
      }
    }, 7500);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Signal-X Management System</h1>
          <p className="text-lg text-gray-600">
            AI-powered real-time traffic monitoring and optimization
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden p-6 mb-8">
          <div className="mb-6">
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
              Select Traffic Location
            </label>
            <div className="flex gap-4">
              <select
                id="location"
                value={selectedPlace}
                onChange={handlePlaceChange}
                className="flex-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                {places.map((place) => (
                  <option key={place.value} value={place.value}>
                    {place.label}
                  </option>
                ))}
              </select>
              {selectedPlace && (
                <button
                  onClick={startProcessing}
                  disabled={isProcessing}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? 'Processing...' : 'Analyze Traffic'}
                </button>
              )}
            </div>
          </div>

          {selectedPlace && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-2">
                  {placeDetails[selectedPlace]?.name || 'Live Feed'}
                </h2>
                <div className="relative bg-black rounded-lg overflow-hidden">
                  <video
                    ref={videoRef}
                    className="w-full h-auto max-h-96 object-contain"
                    controls
                    autoPlay
                    loop
                    muted
                  >
                    <source src={placeDetails[selectedPlace]?.rawVideo} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              </div>

              {isProcessing && (
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <RotateSpinner size={40} color="#3B82F6" />
                    <p className="text-gray-700 font-medium">{processingStep}</p>
                    <p className="text-sm text-gray-500 text-center">
                      Signal-X is analyzing the live feed using YOLOv8 object detection...
                    </p>
                  </div>
                </div>
              )}

              {showProcessedVideo && (
                <div className="space-y-4">
                  <div>
                    <h2 className="text-lg font-medium text-gray-900 mb-2">
                      AI-Processed Traffic Analysis
                    </h2>
                    <div className="relative bg-black rounded-lg overflow-hidden">
                      <video
                        ref={processedVideoRef}
                        className="w-full h-auto max-h-96 object-contain"
                        controls
                        autoPlay
                        loop
                        muted
                      >
                        <source
                          src={placeDetails[selectedPlace]?.processedVideo}
                          type="video/mp4"
                        />
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h3 className="text-md font-semibold text-blue-800 mb-3">Detection Results</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-white p-3 rounded-lg shadow-sm">
                        <p className="text-sm text-gray-500">Vehicles Detected</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {placeDetails[selectedPlace]?.stats.vehiclesDetected}
                        </p>
                      </div>
                      <div className="bg-white p-3 rounded-lg shadow-sm">
                        <p className="text-sm text-gray-500">Congestion Level</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {placeDetails[selectedPlace]?.stats.congestionLevel}
                        </p>
                      </div>
                      <div className="bg-white p-3 rounded-lg shadow-sm">
                        <p className="text-sm text-gray-500">Average Speed</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {placeDetails[selectedPlace]?.stats.avgSpeed}
                        </p>
                      </div>
                      <div className="bg-white p-3 rounded-lg shadow-sm">
                        <p className="text-sm text-gray-500">Emergency Vehicles</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {placeDetails[selectedPlace]?.stats.emergencyVehicles}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <h3 className="text-md font-semibold text-green-800 mb-2">
                      Signal Optimization Recommendations
                    </h3>
                    <ul className="list-disc list-inside text-sm text-green-700 space-y-1">
                      <li>
                        Increase green signal duration by 25% for {placeDetails[selectedPlace]?.name}
                      </li>
                      <li>Prioritize emergency vehicle route clearance</li>
                      <li>Suggest alternate routes for non-essential vehicles</li>
                      <li>Adjust signal phasing to reduce cross-traffic conflicts</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          )}

          {!selectedPlace && (
            <div className="text-center py-12">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
                <svg
                  className="h-6 w-6 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No location selected</h3>
              <p className="mt-1 text-sm text-gray-500">
                Please select a traffic location from the dropdown to begin analysis.
              </p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">How Signal-X Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center mb-3">
                <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-md bg-blue-500 text-white">
                  1
                </div>
                <h3 className="ml-3 text-lg font-medium text-gray-900">Real-time Monitoring</h3>
              </div>
              <p className="mt-2 text-sm text-gray-600">
                Our system continuously monitors traffic flow through city cameras, using computer
                vision to detect vehicles and congestion patterns.
              </p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center mb-3">
                <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-md bg-blue-500 text-white">
                  2
                </div>
                <h3 className="ml-3 text-lg font-medium text-gray-900">AI Analysis</h3>
              </div>
              <p className="mt-2 text-sm text-gray-600">
                YOLOv8-based detection identifies vehicles, pedestrians, and emergency vehicles,
                analyzing traffic density and movement patterns.
              </p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center mb-3">
                <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-md bg-blue-500 text-white">
                  3
                </div>
                <h3 className="ml-3 text-lg font-medium text-gray-900">Dynamic Optimization</h3>
              </div>
              <p className="mt-2 text-sm text-gray-600">
                The system automatically adjusts signal timings and provides route recommendations to
                improve traffic flow and prioritize emergency vehicles.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Places;
import { useState, useEffect } from 'react';
import { FiAlertTriangle, FiClock, FiTrendingUp } from 'react-icons/fi';
import { RotateLoader } from 'react-spinners';

const TrafficDetection = () => {
  // Data state for each lane
  const [lanes, setLanes] = useState([
    { id: 1, loading: true, vehicles: null, greenTime: null, imageLoaded: false },
    { id: 2, loading: true, vehicles: null, greenTime: null, imageLoaded: false },
    { id: 3, loading: true, vehicles: null, greenTime: null, imageLoaded: false },
    { id: 4, loading: true, vehicles: null, greenTime: null, imageLoaded: false },
  ]);

  const [busiestLane, setBusiestLane] = useState(null);
  const [initialLoad, setInitialLoad] = useState(true);

  // Simulate data fetching with delays
  useEffect(() => {
    if (initialLoad) {
      const timer = setTimeout(() => setInitialLoad(false), 2000);
      return () => clearTimeout(timer);
    }

    // Lane 1 data after 5 seconds
    const timer1 = setTimeout(() => {
      setLanes(prev => prev.map(lane => 
        lane.id === 1 ? { ...lane, loading: false, vehicles: 18, greenTime: 24 } : lane
      ));
    }, 5000);

    // Lane 2 data after 20 seconds (15s after lane 1)
    const timer2 = setTimeout(() => {
      setLanes(prev => prev.map(lane => 
        lane.id === 2 ? { ...lane, loading: false, vehicles: 32, greenTime: 31 } : lane
      ));
    }, 20000);

    // Lane 3 data after 35 seconds (15s after lane 2)
    const timer3 = setTimeout(() => {
      setLanes(prev => prev.map(lane => 
        lane.id === 3 ? { ...lane, loading: false, vehicles: 10, greenTime: 22 } : lane
      ));
    }, 35000);

    // Lane 4 data after 50 seconds (15s after lane 3)
    const timer4 = setTimeout(() => {
      setLanes(prev => prev.map(lane => 
        lane.id === 4 ? { ...lane, loading: false, vehicles: 23, greenTime: 22 } : lane
      ));
      setBusiestLane(2); // Lane 2 has highest vehicle count
    }, 50000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [initialLoad]);

  // Handle image load
  const handleImageLoad = (id) => {
    setLanes(prev => prev.map(lane => 
      lane.id === id ? { ...lane, imageLoaded: true } : lane
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">SignalX Traffic Logs</h1>
        <p className="text-gray-600 mb-8">Real-time traffic monitoring and analysis</p>

        {initialLoad ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <RotateLoader color="#3B82F6" size={15} />
              <p className="mt-4 text-gray-600">Initializing traffic monitoring system...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Lane Images Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {lanes.map((lane) => (
                <div key={lane.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
                  <div className="p-4 bg-gray-800 flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-white">Lane {lane.id}</h2>
                    {busiestLane === lane.id && (
                      <span className="flex items-center text-yellow-300 text-sm">
                        <FiTrendingUp className="mr-1" /> Busiest Lane
                      </span>
                    )}
                  </div>
                  
                  <div className="relative h-64 bg-gray-100 flex items-center justify-center">
                    {!lane.imageLoaded && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <RotateLoader color="#6B7280" size={10} />
                      </div>
                    )}
                    <img 
                      src={`/images/lane${lane.id}.png`} 
                      alt={`Lane ${lane.id} traffic`}
                      className={`w-full h-full object-cover ${lane.imageLoaded ? 'block' : 'hidden'}`}
                      onLoad={() => handleImageLoad(lane.id)}
                    />
                  </div>
                  
                  <div className="p-4 border-t border-gray-200">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-500">Vehicles Detected:</span>
                      {lane.loading ? (
                        <div className="w-8 h-6 flex items-center justify-center">
                          <RotateLoader color="#6B7280" size={5} />
                        </div>
                      ) : (
                        <span className="text-lg font-bold text-gray-800">{lane.vehicles}</span>
                      )}
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-500">Assigned Green Time:</span>
                      {lane.loading ? (
                        <div className="w-8 h-6 flex items-center justify-center">
                          <RotateLoader color="#6B7280" size={5} />
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <FiClock className="text-gray-500 mr-1" />
                          <span className="text-gray-800">{lane.greenTime}s</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Traffic Summary */}
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <FiAlertTriangle className="text-yellow-500 mr-2" />
                Recent Traffic Summary
              </h2>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lane</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicles Detected</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Green Time</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {lanes.map((lane) => (
                      <tr key={lane.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Lane {lane.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {lane.loading ? (
                            <div className="w-8 h-4 flex items-center justify-center">
                              <RotateLoader color="#6B7280" size={3} />
                            </div>
                          ) : (
                            lane.vehicles
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {lane.loading ? (
                            <div className="w-8 h-4 flex items-center justify-center">
                              <RotateLoader color="#6B7280" size={3} />
                            </div>
                          ) : (
                            `${lane.greenTime}s`
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {lane.loading ? (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                              Processing
                            </span>
                          ) : busiestLane === lane.id ? (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                              High Traffic
                            </span>
                          ) : (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              Normal
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-4 text-sm text-gray-500 flex items-center">
                <FiClock className="mr-1" />
                Last updated: {new Date().toLocaleTimeString()}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TrafficDetection;
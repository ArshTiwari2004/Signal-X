import React, { useState } from "react";
import { Video, Maximize2, Minimize2, Settings, X } from "lucide-react";
import video1 from "/normal/test_video.mp4";
import video2 from "/normal/video3.mp4";
import video3 from "/normal/traffic1.mp4";
import video4 from "/normal/video1.mp4";

const CCTVFeeds = () => {
  const videos = [video1, video2, video3, video4];
  const [enlargedVideo, setEnlargedVideo] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [selectedCamera, setSelectedCamera] = useState(0);
  const [controlValues, setControlValues] = useState({
    pan: 45,
    tilt: 30,
    zoom: 20,
  });
  
  const handleControlChange = (control, value) => {
    setControlValues(prev => ({
      ...prev,
      [control]: value
    }));
  };
  
  const handleEnlargeVideo = (index) => {
    setEnlargedVideo(index);
    setSelectedCamera(index);
  };
  
  const handleCloseEnlarged = () => {
    setEnlargedVideo(null);
  };
  
  const toggleRecording = () => {
    setIsRecording(!isRecording);
  };
  
  const stats = [
    { label: "Vehicles Detected", count: 45, change: "+5" },
    { label: "Average Speed", count: "42 km/h", change: "-2" },
    { label: "Traffic Density", count: "Medium", change: "↑" },
  ];

  return (
    <div className="space-y-6 relative">
      {/* Enlarged Video Modal */}
      {enlargedVideo !== null && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-6">
          <div className="bg-gray-900 rounded-xl w-full max-w-5xl">
            <div className="p-4 flex justify-between items-center border-b border-gray-700">
              <h3 className="font-bold">Camera {enlargedVideo + 1} - Junction {enlargedVideo + 1}</h3>
              <button 
                onClick={handleCloseEnlarged}
                className="p-2 hover:bg-gray-800 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="relative">
                <video
                  src={videos[enlargedVideo]}
                  className="w-full h-[60vh] rounded-lg object-cover"
                  autoPlay
                  loop
                  muted
                  controls
                />
                <div className="absolute bottom-4 left-4 px-3 py-1.5 bg-gray-800/80 rounded text-sm flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  Live
                </div>
                {isRecording && (
                  <div className="absolute bottom-4 right-4 px-3 py-1.5 bg-red-600/80 rounded text-sm flex items-center gap-2">
                    <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                    Recording
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">CCTV Feeds</h2>
        <div className="flex gap-4">
          <button 
            onClick={toggleRecording}
            className={`${isRecording ? 'bg-red-700 hover:bg-red-800' : 'bg-red-600 hover:bg-red-700'} px-4 py-2 rounded-lg flex items-center gap-2 transition-colors duration-200`}
          >
            <Video className="w-4 h-4" />
            <span>{isRecording ? 'Stop Recording' : 'Record'}</span>
          </button>
          <button className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors duration-200">
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* CCTV Feeds */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          {videos.map((videoSrc, index) => (
            <div 
              key={index} 
              className={`bg-gray-800 rounded-xl p-4 transition-all duration-300 ${selectedCamera === index ? 'ring-2 ring-blue-500' : ''}`}
              onClick={() => setSelectedCamera(index)}
            >
              <div className="relative">
                {/* Video Feed */}
                <video
                  src={videoSrc}
                  className="w-full h-48 rounded-lg object-cover"
                  autoPlay
                  loop
                  muted
                />
                
                {/* Maximize Button */}
                <button 
                  className="absolute top-2 right-2 p-1.5 bg-gray-800/80 rounded hover:bg-gray-700 transition-colors duration-200"
                  onClick={() => handleEnlargeVideo(index)}
                >
                  <Maximize2 className="w-4 h-4" />
                </button>

                {/* Live Indicator */}
                <div className="absolute bottom-2 left-2 px-2 py-1 bg-gray-800/80 rounded text-xs flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  Live
                </div>
                
                {isRecording && index === selectedCamera && (
                  <div className="absolute bottom-2 right-10 px-2 py-1 bg-red-600/80 rounded text-xs flex items-center gap-2">
                    <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                    REC
                  </div>
                )}
              </div>

              {/* Camera Info */}
              <div className="mt-3">
                <h3 className="font-medium">Camera {index + 1}</h3>
                <p className="text-sm text-gray-400">Junction {index + 1}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Camera Controls and Stats */}
        <div className="space-y-6">
          <div className="bg-gray-800 rounded-xl p-6">
            <h3 className="font-semibold mb-4">Camera Controls</h3>
            <div className="space-y-5">
              {Object.entries(controlValues).map(([control, value]) => (
                <div key={control} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400 capitalize">{control}</span>
                    <span className="text-sm">
                      {control === 'zoom' ? `${value / 10}x` : `${value}°`}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max={control === 'zoom' ? "100" : "180"}
                    value={value}
                    onChange={(e) => handleControlChange(control, parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500"
                  />
                </div>
              ))}
              
              <div className="grid grid-cols-2 gap-3 mt-4">
                <button className="bg-blue-600 hover:bg-blue-700 p-2 rounded-lg text-center text-sm transition-colors duration-200">
                  Reset Position
                </button>
                <button className="bg-gray-700 hover:bg-gray-600 p-2 rounded-lg text-center text-sm transition-colors duration-200">
                  Auto Track
                </button>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6">
            <h3 className="font-semibold mb-4">Detection Status</h3>
            <div className="space-y-3">
              {stats.map((stat, index) => (
                <div key={index} className="bg-gray-700 p-4 rounded-lg hover:bg-gray-650 transition-colors duration-200">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">{stat.label}</span>
                    <div className="text-right">
                      <span className="block font-medium">{stat.count}</span>
                      <span className={`text-sm ${stat.change.includes('-') ? 'text-red-400' : 'text-green-400'}`}>
                        {stat.change}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              
              <button className="w-full mt-2 bg-gray-700 hover:bg-gray-600 p-2 rounded-lg text-center text-sm transition-colors duration-200">
                View Detailed Analytics
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CCTVFeeds;
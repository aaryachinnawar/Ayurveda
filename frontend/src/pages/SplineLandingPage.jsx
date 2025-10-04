import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Spline from '@splinetool/react-spline';

const SplineLandingPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  const handleGetStarted = () => {
    navigate('/login');
  };

  const handleSplineLoad = () => {
    setIsLoading(false);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Loading State */}
      {isLoading && (
        <div className="absolute inset-0 z-20 bg-white flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Loading amazing experience...</p>
          </div>
        </div>
      )}
      
      {/* Spline Design */}
      <div className="absolute inset-0 z-0">
        <Spline 
          scene="https://prod.spline.design/StqsSJTj-Jua6uGH/scene.splinecode" 
          onLoad={handleSplineLoad}
        />
      </div>
      
      {/* Get Started Button */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
        <button
          onClick={handleGetStarted}
          className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-4 px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-lg"
        >
          Get Started
        </button>
      </div>
    </div>
  );
};

export default SplineLandingPage; 
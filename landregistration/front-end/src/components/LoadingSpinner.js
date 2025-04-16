import React from 'react';
import '../styles.css';

const LoadingSpinner = ({ size = "medium" }) => {
  const spinnerSize = {
    small: "30px",
    medium: "50px",
    large: "70px"
  };

  return (
    <div className="spinner-container">
      <div 
        className="spinner"
        style={{ 
          width: spinnerSize[size], 
          height: spinnerSize[size] 
        }}
      ></div>
    </div>
  );
};

export default LoadingSpinner;
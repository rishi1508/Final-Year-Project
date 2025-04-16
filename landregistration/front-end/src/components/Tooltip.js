import React from 'react';

const Tooltip = ({ text }) => {
  return (
    <span className="tooltip-container">
      <i className="bi bi-info-circle info-icon"></i>
      <span className="tooltip-text">{text}</span>
    </span>
  );
};

export default Tooltip;
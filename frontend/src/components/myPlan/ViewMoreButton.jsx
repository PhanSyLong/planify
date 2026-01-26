import React from 'react';
import './ViewMoreButton.css';

const ViewMoreButton = ({ children = 'View More →', onClick }) => {
  return (
    <button className="view-more-btn" onClick={onClick}>
      {children}
    </button>
  );
};

export default ViewMoreButton;
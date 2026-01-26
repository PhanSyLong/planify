import React from 'react';

const ViewMoreButton = ({ children = 'View More →', onClick }) => {
  return (
    <button
      className="view-more-btn"
      onClick={onClick}
      style={{
        background: 'none',
        color: '#5b5fef',
        fontSize: '14px',
        fontWeight: 600,
        padding: '6px 0',
        height: 'auto',
        borderRadius: 0,
        transition: 'color 0.2s ease'
      }}
      onMouseEnter={(e) => {
        e.target.style.color = '#4338ca';
        e.target.style.textDecoration = 'underline';
        e.target.style.background = 'none';
      }}
      onMouseLeave={(e) => {
        e.target.style.color = '#5b5fef';
        e.target.style.textDecoration = 'none';
        e.target.style.background = 'none';
      }}
    >
      {children}
    </button>
  );
};

export default React.memo(ViewMoreButton);
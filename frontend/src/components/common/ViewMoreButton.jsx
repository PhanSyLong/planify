// src/components/common/ViewMoreButton.jsx
// ViewMoreButton.jsx
import React from "react";

const ViewMoreButton = ({ children = "Xem thêm →", onClick }) => {
  return (
    <>
      <style jsx="true">{`
        .view-more-btn {
          background: none;
          border: none;
          color: #4f46e5;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          padding: 8px 0;
          transition: all 0.3s ease;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }

        .view-more-btn:hover {
          color: #4338ca;
          text-decoration: underline;
        }

        .view-more-btn:focus-visible {
          outline: 2px solid #4f46e5;
          outline-offset: 2px;
          border-radius: 4px;
        }
      `}</style>

      <button className="view-more-btn" onClick={onClick}>
        {children}
      </button>
    </>
  );
};

export default ViewMoreButton;
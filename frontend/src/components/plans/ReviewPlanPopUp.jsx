import React, { useEffect, useRef } from 'react';
import './ReviewPlanPopUp.css';

const ReviewPlanPopup = ({ isOpen, onClose, containerRef, reviewData, isLoading }) => {
  const popupRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target)
      ) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  // Prevent body scroll when popup is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Debug logging
  console.log('ReviewPlanPopup rendered:', { isOpen, reviewData, isLoading });

  const {
    totalSubtasks = 0,
    cancelled = 0,
    completedOnTime = 0,
    completedLate = 0,
    inProgress = 0,
    notStarted = 0,
  } = reviewData || {};



  return (
    <>
      <div className="review-popup-backdrop" onClick={onClose} />
      <div className="review-popup" ref={popupRef}>
        <div className="review-header">
          <h3>Plan Review</h3>
          <button className="close-btn" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        <div className="review-content">
          {isLoading ? (
            <div className="review-loading">
              <div className="spinner"></div>
              <p>Loading statistics...</p>
            </div>
          ) : (
            <div className="review-stats">
              <div className="stat-item total">
                <div className="stat-icon">📊</div>
                <div className="stat-info">
                  <span className="stat-value">{totalSubtasks}</span>
                  <span className="stat-label">Total Subtasks</span>
                </div>
              </div>

              <div className="stat-item success">
                <div className="stat-icon">✓</div>
                <div className="stat-info">
                  <span className="stat-value">{completedOnTime}</span>
                  <span className="stat-label">Completed on Time</span>
                </div>
              </div>

              <div className="stat-item warning">
                <div className="stat-icon">⏰</div>
                <div className="stat-info">
                  <span className="stat-value">{completedLate}</span>
                  <span className="stat-label">Completed Late</span>
                </div>
              </div>

              <div className="stat-item progress">
                <div className="stat-icon">🔄</div>
                <div className="stat-info">
                  <span className="stat-value">{inProgress}</span>
                  <span className="stat-label">In Progress</span>
                </div>
              </div>

              <div className="stat-item incomplete">
                <div className="stat-icon">○</div>
                <div className="stat-info">
                  <span className="stat-value">{notStarted}</span>
                  <span className="stat-label">Not Started</span>
                </div>
              </div>

              <div className="stat-item cancelled">
                <div className="stat-icon">✕</div>
                <div className="stat-info">
                  <span className="stat-value">{cancelled}</span>
                  <span className="stat-label">Cancelled</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ReviewPlanPopup;
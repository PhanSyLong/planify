import React, { useEffect, useRef } from 'react';
import './ReviewPlanPopUp.css';

const ReviewPlanPopup = ({ isOpen, onClose, containerRef, reviewData }) => {
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
  console.log('ReviewPlanPopup rendered:', { isOpen, reviewData });

  const {
    totalSubtasks = 0,
    cancelled = 0,
    completedOnTime = 0,
    completedLate = 0,
    inProgress = 0,
    incomplete = 0,
  } = reviewData || {};

  const completionRate = totalSubtasks > 0
    ? Math.round((completedOnTime / totalSubtasks) * 100)
    : 0;

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
          <div className="review-summary">
            <div className="summary-circle">
              <div className="circle-progress" style={{ '--progress': completionRate }}>
                <span className="percentage">{completionRate}%</span>
              </div>
              <p className="summary-label">Completion Rate</p>
            </div>
          </div>

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
                <span className="stat-value">{incomplete}</span>
                <span className="stat-label">Incomplete</span>
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
        </div>
      </div>
    </>
  );
};

export default ReviewPlanPopup;
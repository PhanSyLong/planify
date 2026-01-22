import React, { useState, useMemo, useCallback } from 'react';
import PlanCard from './PlanCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import './PlanList.css';

const PlanList = ({ plans = [], initialPlans, isFullView = false, fullViewTitle, onBack }) => {
  const planData = useMemo(() => {
    return plans.length > 0 ? plans : initialPlans || [];
  }, [plans, initialPlans]);

  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value);
  }, []);

  const filteredItems = useMemo(() => {
    if (!searchTerm) return planData;

    const search = searchTerm.toLowerCase();
    return planData.filter(item => {
      const text = (item?.title || '').toLowerCase();
      return text.includes(search);
    });
  }, [planData, searchTerm]);

  return (
    <div className="planlist-wrapper">
      <div className="planlist-container">
        <div className="planlist-header">
          {isFullView && (
            <>
              <button
                className="back-btn"
                onClick={onBack}
                aria-label="Go back"
              >
                <FontAwesomeIcon icon={faArrowLeft} className="icon" />
                Back
              </button>
              <h1 className="page-title">{fullViewTitle}</h1>
            </>
          )}

          <div className="search-box">
            <input
              type="text"
              placeholder="Search plans..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="search-input"
              aria-label="Search plans"
            />
            <svg
              className="search-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
        </div>

        <div className="planlist-grid">
          {filteredItems.length > 0 ? (
            filteredItems.map(item => (
              <div key={item.id} className="plan-card-wrapper">
                <PlanCard item={item} />
              </div>
            ))
          ) : (
            <div className="no-results">
              {searchTerm
                ? `No results found for "${searchTerm}"`
                : 'No plans available yet.'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default React.memo(PlanList);
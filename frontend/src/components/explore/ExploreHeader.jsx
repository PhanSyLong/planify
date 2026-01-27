import React, { useState, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import './ExploreHeader.css';

const TABS = [
  { id: 'subject', label: 'Subjects' },
  { id: 'certificate', label: 'Certificates' },
  { id: 'other', label: 'Other' }
];

const ExploreHeader = ({ activeTab, setActiveTab }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = useCallback((e) => {
    e.preventDefault();
    console.log('Searching for:', searchTerm);
    // TODO: Implement actual search
  }, [searchTerm]);

  const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value);
  }, []);

  const handleTabClick = useCallback((tabId) => {
    setActiveTab(tabId);
  }, [setActiveTab]);

  return (
    <div className="explore-header">
      <form className="search-bar" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search courses, teachers..."
          value={searchTerm}
          onChange={handleSearchChange}
          aria-label="Search"
        />

        <button
          type="submit"
          className="search-icon-btn"
          aria-label="Search"
        >
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            className="search-icon"
          />
        </button>
      </form>

      <div className="main-tabs">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => handleTabClick(tab.id)}
            aria-pressed={activeTab === tab.id}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default React.memo(ExploreHeader);
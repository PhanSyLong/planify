import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import './ExploreHeader.css';

const ExploreHeader = ({ activeTab, setActiveTab }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Searching for:', searchTerm);
    // TODO: Implement actual search
  };

  const tabs = [
    { id: 'subject', label: 'Subjects' },
    { id: 'certificate', label: 'Certificates' },
    { id: 'other', label: 'Other' }
  ];

  return (
    <div className="explore-header">
      <form className="search-bar" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Tìm kiếm khóa học, giáo viên..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <button
          type="submit"
          className="search-icon-btn"
          aria-label="Tìm kiếm"
        >
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            className="search-icon"
            size="lg"  // Optional: makes it slightly bolder, looks great at small size
          />
        </button>
      </form>

      <div className="main-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
            aria-pressed={activeTab === tab.id}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ExploreHeader;
// src/components/explore/ExploreHeader.jsx
import React from 'react';
import SearchIcon from '../../assets/icons/search.svg';

const ExploreHeader = ({ activeTab, setActiveTab }) => {
  return (
    <div className="header">
      <div className="search-bar">
        <input type="text" placeholder="Tìm kiếm khóa học, giáo viên..." />

        <span className="search-icon flex items-center gap-2 text-gray-600 font-medium">
          <img
            src={SearchIcon}
            className="w-10 h-10 "
          />
        </span>
      </div>

      <div className="main-tabs">
        {['subject', 'certificate', 'other'].map(tab => (
          <button
            key={tab}
            className={activeTab === tab ? 'active' : ''}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'subject' ? 'Môn học' : tab === 'certificate' ? 'Chứng chỉ' : 'Khác'}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ExploreHeader;
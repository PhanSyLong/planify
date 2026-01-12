import React, { useState } from 'react';
import UserCard from './UserCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import './UserList.css'; // Bạn có thể copy styles từ PlanList.css và chỉnh nhẹ

const UserList = ({
  users = [],
  initialUsers,
  isFullView = false,
  fullViewTitle,
  onBack,
}) => {
  // Hỗ trợ cả props users và initialUsers để tương thích với code cũ
  const userData = users.length > 0 ? users : initialUsers || [];

  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = userData.filter((user) => {
    const search = searchTerm.toLowerCase();
    const name = (user?.name || '').toLowerCase();
    const description = (user?.description || '').toLowerCase();
    return name.includes(search) || description.includes(search);
  });

  return (
    <div className="userlist-wrapper">
      <div className="userlist-container">
        {/* Header */}
        <div
          className="userlist-header"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {isFullView && (
            <>
              <button
                className="back-btn"
                onClick={onBack}
                style={{ marginRight: '10px' }}
              >
                <FontAwesomeIcon icon={faArrowLeft} />
              </button>
              <h1 className="page-title" style={{ flex: 1, margin: 0 }}>
                {fullViewTitle}
              </h1>
            </>
          )}

          <div className="search-box" style={{ flex: isFullView ? 'none' : 1 }}>
            <input
              type="text"
              placeholder="Search teachers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <svg
              className="search-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
        </div>

        {/* Grid */}
        <div className="userlist-grid">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <div key={user.id} className="user-card-wrapper">
                <UserCard user={user} />
              </div>
            ))
          ) : (
            <div className="no-results">
              {searchTerm
                ? `No teachers found for "${searchTerm}"`
                : 'No teachers available yet.'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserList;
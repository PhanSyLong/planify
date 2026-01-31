import React, { useState, useMemo, useCallback } from 'react';
import UserCard from './UserCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import './UserList.css';

const UserList = ({
  users = [],
  initialUsers,
  isFullView = false,
  fullViewTitle,
  onBack,
}) => {
  const userData = useMemo(() => {
    return users.length > 0 ? users : initialUsers || [];
  }, [users, initialUsers]);

  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value);
  }, []);

  const filteredUsers = useMemo(() => {
    if (!searchTerm.trim()) return userData;

    const search = searchTerm.toLowerCase().trim();
    return userData.filter((user) => {
      const username = (user?.username || '').toLowerCase();
      const email = (user?.email || '').toLowerCase();
      return username.includes(search) || email.includes(search);
    });
  }, [userData, searchTerm]);

  return (
    <div className="userlist-wrapper">
      <div className="userlist-container">
        <div className="userlist-header">
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
              <h1 className="page-title">{fullViewTitle || 'Teachers'}</h1>
            </>
          )}

          <div className="search-box">
            <input
              type="text"
              placeholder="Search by username or email..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="search-input"
              aria-label="Search teachers"
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

export default React.memo(UserList);
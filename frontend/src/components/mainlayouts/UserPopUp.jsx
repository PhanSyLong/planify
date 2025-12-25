import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faRotate,
  faArrowRightFromBracket
} from '@fortawesome/free-solid-svg-icons';
import './UserPopUp.css';

const UserMenuPopup = ({ isOpen, onClose, userAvatar, userName }) => {
  const popupRef = useRef(null);
  const navigate = useNavigate();

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Handle navigation
  const handleMenuClick = (path) => {
    navigate(path);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="user-menu-popup" ref={popupRef}>
      {/* Profile */}
      <div
        className="menu-item"
        onClick={() => handleMenuClick('/myprofile')}
      >
        <div className="menu-icon">
          {userAvatar ? (
            <img
              src={userAvatar}
              alt={userName}
              className="user-avatar"
            />
          ) : (
            <div className="avatar-placeholder">
              {userName ? userName.charAt(0).toUpperCase() : 'U'}
            </div>
          )}
        </div>
        <span className="menu-text">My Profile</span>
      </div>

      {/* Switch role */}
      <div
        className="menu-item"
        onClick={() => handleMenuClick('/switch-role')}
      >
        <div className="menu-icon">
          <FontAwesomeIcon icon={faRotate} />
        </div>
        <span className="menu-text">Switch Role</span>
      </div>

      <div className="menu-divider" />

      {/* Logout */}
      <div
        className="menu-item"
        onClick={() => handleMenuClick('/logout')}
      >
        <div className="menu-icon">
          <FontAwesomeIcon icon={faArrowRightFromBracket} />
        </div>
        <span className="menu-text">Log out</span>
      </div>
    </div>
  );
};

export default UserMenuPopup;

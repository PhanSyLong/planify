import React, { useEffect, useRef } from 'react';
import './LanguageDropdown.css'; // We'll create this next

const LanguageDropdown = ({ isOpen, onClose, containerRef, currentLanguage, onChangeLanguage }) => {
  const dropdownRef = useRef(null);

  // Handle click outside (ignores clicks on globe icon)
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        containerRef?.current &&
        !containerRef.current.contains(event.target)
      ) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose, containerRef]);

  if (!isOpen) return null;

  return (
    <div className="language-dropdown" ref={dropdownRef}>
      <div className="language-header">
        <h3>Language</h3>
      </div>
      <div className="language-list">
        <button
          className={`language-item ${currentLanguage === 'en' ? 'selected' : ''}`}
          onClick={() => {
            onChangeLanguage('en');
            onClose();
          }}
        >
          English
        </button>
        <button
          className={`language-item ${currentLanguage === 'vi' ? 'selected' : ''}`}
          onClick={() => {
            onChangeLanguage('vi');
            onClose();
          }}
        >
          Tiếng Việt
        </button>
      </div>
    </div>
  );
};

export default LanguageDropdown;
import React, { useState, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookmark as faBookmarkSolid } from '@fortawesome/free-solid-svg-icons';
import { faBookmark as faBookmarkRegular } from '@fortawesome/free-regular-svg-icons';
import './LikeButton.css';

const LikeButton = ({ itemId, type, isLiked: controlledLiked, onToggle }) => {
  const [internalLiked, setInternalLiked] = useState(false);

  const isSaved = controlledLiked !== undefined ? controlledLiked : internalLiked;

  const handleToggle = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();

    if (onToggle) {
      const uniqueKey = `${type || 'plan'}-${itemId}`;
      onToggle(uniqueKey, !isSaved);
    } else {
      setInternalLiked(prev => !prev);
    }
  }, [onToggle, type, itemId, isSaved]);

  return (
    <button
      className={`like-btn ${isSaved ? 'saved' : ''}`}
      onClick={handleToggle}
      aria-label={isSaved ? 'Remove bookmark' : 'Bookmark'}
      aria-pressed={isSaved}
    >
      <FontAwesomeIcon
        icon={isSaved ? faBookmarkSolid : faBookmarkRegular}
        className="bookmark-icon"
      />
    </button>
  );
};

export default React.memo(LikeButton);
import React, { useState, useCallback, use } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookmark as faBookmarkSolid } from '@fortawesome/free-solid-svg-icons';
import { faBookmark as faBookmarkRegular } from '@fortawesome/free-regular-svg-icons';
import './LikeButton.css';
import { useBookmarks } from '../../queries/useBookmarks';

const LikeButton = ({ itemId, type = 'plan' }) => {
  const { bookmarks, isBookmarked, toggleBookmark, togglingId } = useBookmarks();

  if (type != 'plan') return null;

  const isSaved = isBookmarked(itemId);
  const isDisabled = togglingId === itemId;

  const handleToggle = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleBookmark(itemId);
  }, [itemId, toggleBookmark]);

  return (
    <button
      className={`like-btn ${isSaved ? 'saved' : ''}`}
      disabled={isDisabled}
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
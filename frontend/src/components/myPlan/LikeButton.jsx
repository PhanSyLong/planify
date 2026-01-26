import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark as faBookmarkSolid } from "@fortawesome/free-solid-svg-icons";
import { faBookmark as faBookmarkRegular } from "@fortawesome/free-regular-svg-icons";

import "./LikeButton.css";  // or your path: src/styles/LikeButton.css

const LikeButton = ({ itemId, type, isLiked: controlledLiked, onToggle }) => {
  const [internalLiked, setInternalLiked] = useState(false);

  // "Liked" now means "bookmarked/saved"
  const isSaved = controlledLiked !== undefined ? controlledLiked : internalLiked;

  const handleToggle = () => {
    if (onToggle) {
      const uniqueKey = `${type}-${itemId}`;
      onToggle(uniqueKey, !isSaved);
    } else {
      setInternalLiked((prev) => !prev);
    }
  };

  return (
    <button
      className={`like-btn ${isSaved ? "saved" : ""}`}
      onClick={handleToggle}
      aria-label={isSaved ? "Remove bookmark" : "Bookmark"}
      aria-pressed={isSaved}
    >
      <FontAwesomeIcon
        icon={isSaved ? faBookmarkSolid : faBookmarkRegular}
        className="bookmark-icon"
      />
    </button>
  );
};

export default LikeButton;
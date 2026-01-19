// src/components/explore/ExploreTags.jsx
import React from 'react';
import './ExploreTags.css';

const tagGroups = {
  subject: [
    "Math", "Physics", "Chemistry", "Literature", "English",
    "Biology", "History", "Geography", "Computer Science"
  ],
  certificate: [
    "IELTS", "TOEIC", "VSTEP", "SAT", "IELTS UKVI", "TOPIK"
  ],
  other: [
    "Soft Skills", "Programming", "Design", "Marketing", "Foreign Languages"
  ],
};
const ExploreTags = ({ activeTab, pinnedTags, onPin, onUnpin }) => {
  const currentTags = tagGroups[activeTab] || [];
  const availableTags = currentTags.filter(tag => !pinnedTags.includes(tag));

  return (
    <div className="tags-box">
      {/* Pinned Tags Section */}
      {pinnedTags.length > 0 && (
        <div className="pinned-tags">
          <div className="pinned-label">Pinned:</div>
          <div className="pinned-tags-list">
            {pinnedTags.map(tag => (
              <span
                key={`pinned-${tag}`}
                className="tag pinned"
              >
                <strong>{tag}</strong>
                <button
                  className="unpin-btn"
                  onClick={() => onUnpin(tag)}
                  aria-label={`Unpin ${tag}`}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Available Tags Section */}
      {availableTags.length > 0 && (
        <div className="tags-container">
          {availableTags.map((tag, index) => (
            <button
              key={`tag-${index}`}
              className="tag"
              onClick={() => onPin(tag)}
              aria-label={`Ghim ${tag}`}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {/* Empty State */}
      {availableTags.length === 0 && pinnedTags.length === 0 && (
        <div className="empty-tags">
          <p>Không có thẻ nào khả dụng</p>
        </div>
      )}
    </div>
  );
};

export default ExploreTags;
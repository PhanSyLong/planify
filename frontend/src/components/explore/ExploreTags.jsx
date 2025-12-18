// src/components/explore/ExploreTags.jsx
import React from 'react';

const tagGroups = {
  subject: ['Toán', 'Lý', 'Hóa', 'Văn', 'Anh', 'Sinh', 'Sử', 'Địa', 'Tin học'],
  certificate: ['IELTS', 'TOEIC', 'VSTEP', 'SAT', 'IELTS UKVI', 'TOPIK'],
  other: ['Kỹ năng mềm', 'Lập trình', 'Thiết kế', 'Marketing', 'Ngoại ngữ'],
};

const ExploreTags = ({ activeTab, pinnedTags, onPin, onUnpin }) => {
  const currentTags = tagGroups[activeTab] || [];

  return (
    <div className="tags-box">
      {pinnedTags.length > 0 && (
        <div className="pinned-tags">
          {pinnedTags.map(tag => (
            <span key={`pinned-${tag}`} className="tag pinned">
              <strong>{tag}</strong>
              <button className="unpin-btn" onClick={() => onUnpin(tag)}>×</button>
            </span>
          ))}
        </div>
      )}

      <div className="tags-container">
        {currentTags
          .filter(tag => !pinnedTags.includes(tag))
          .map((tag, i) => (
            <span key={i} className="tag" onClick={() => onPin(tag)}>
              {tag}
            </span>
          ))}
      </div>
    </div>
  );
};

export default ExploreTags;
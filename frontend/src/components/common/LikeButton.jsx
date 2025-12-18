// LikeButton.jsx
import React from "react";

const LikeButton = ({ itemId, type, isLiked: controlledLiked, onToggle }) => {
  // If no controlled props are passed → use internal state (perfect for standalone usage)
  const [internalLiked, setInternalLiked] = React.useState(false);

  const isLiked = controlledLiked !== undefined ? controlledLiked : internalLiked;
  const handleToggle = onToggle || (() => setInternalLiked((prev) => !prev));

  const uniqueKey = `${type}-${itemId}`;

  return (
    <>
      {/* Embedded styles – only this button, no global pollution */}
      <style jsx="true">{`
        .like-btn {
          position: absolute;
          bottom: 12px;
          right: 12px;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: white;
          border: none;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.18);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          z-index: 10;
        }

        .like-btn:hover {
          transform: translateY(-4px) scale(1.08);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.22);
        }

        .like-btn svg {
          width: 26px;
          height: 26px;
          fill: #94a3b8;
          transition: fill 0.25s ease;
        }

        .like-btn.liked svg {
          fill: #ef4444;
        }
      `}</style>

      <button
        className={`like-btn ${isLiked ? "liked" : ""}`}
        onClick={() => handleToggle(uniqueKey)}
        aria-label={isLiked ? "Unlike" : "Like"}
      >
        <svg viewBox="0 0 24 24">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      </button>
    </>
  );
};

export default LikeButton;
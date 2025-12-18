// src/components/common/Carousel.jsx
import React, { useState, useEffect, useRef } from 'react';
import PlanCard from './PlanCard';
import ViewMoreButton from './ViewMoreButton';

import PrevIcon from '../../assets/icons/PreviousBtn.svg';
import NextIcon from '../../assets/icons/NextBtn.svg';

const Carousel = ({ title, items, type, onViewMore }) => {
  const [offset, setOffset] = useState(0);
  const wrapperRef = useRef(null);
  const [visibleItems, setVisibleItems] = useState(5);

  const CARD_WIDTH = 240;
  const GAP = 24;
  const ITEM_TOTAL_WIDTH = CARD_WIDTH + GAP;

  // Tính số card hiển thị theo width màn hình
  useEffect(() => {
    const calculateVisible = () => {
      if (wrapperRef.current) {
        const width = wrapperRef.current.offsetWidth;
        const calculated = Math.floor(width / ITEM_TOTAL_WIDTH);
        setVisibleItems(Math.max(1, calculated));
      }
    };

    calculateVisible();
    window.addEventListener('resize', calculateVisible);
    return () => window.removeEventListener('resize', calculateVisible);
  }, []);

  const maxOffset = Math.max(0, items.length - visibleItems);
  const hasPrev = offset > 0;
  const hasNext = offset < maxOffset;

  return (
    <>
      <style jsx="true">{`
        .carousel-box {
          background: white;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
          margin-bottom: 32px auto;
          max-width: 1400px;
          overflow: hidden;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .section-title {
          font-size: 22px;
          font-weight: 600;
          margin: 0;
          color: #1e293b;
        }

        .carousel {
          position: relative;
          margin: 0 -24px;
        }

        .carousel-wrapper {
          overflow-x: auto;
          overflow-y: hidden;
          scroll-behavior: smooth;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
          padding: 8px 24px;
        }

        .carousel-wrapper::-webkit-scrollbar {
          display: none;
        }

        .carousel-track {
          display: flex;
          gap: 24px;
          padding: 8px 0;
          width: max-content;
          min-width: 100%;
          will-change: transform;
          transition: transform 0.55s cubic-bezier(0.32, 0.72, 0, 1);
        }

        /* Fade gradient */
        .carousel::before,
        .carousel::after {
          content: '';
          position: absolute;
          top: 0;
          bottom: 0;
          width: 80px;
          pointer-events: none;
          z-index: 10;
          opacity: 0;
          transition: opacity 0.4s ease;
        }

        .carousel::before {
          left: 0;
          background: linear-gradient(to right, rgba(255,255,255,1), rgba(255,255,255,0));
        }

        .carousel::after {
          right: 0;
          background: linear-gradient(to left, rgba(255,255,255,1), rgba(255,255,255,0));
        }

        .carousel[data-has-prev="true"]::before { opacity: 1; }
        .carousel[data-has-next="true"]::after { opacity: 1; }

        /* Nav buttons */
        .nav-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(0,0,0,0.7);
          color: white;
          border: none;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          cursor: pointer;
          z-index: 20;
          backdrop-filter: blur(12px);
          opacity: 0;
          pointer-events: none;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .nav-btn:hover {
          background: rgba(0,0,0,0.9);
          transform: translateY(-50%) scale(1.15);
        }

        .nav-btn.left  { left: 16px; }
        .nav-btn.right { right: 16px; }

        .carousel[data-has-prev="true"]  .nav-btn.left,
        .carousel[data-has-next="true"] .nav-btn.right {
          opacity: 1;
          pointer-events: all;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .carousel-box { padding: 20px; margin: 20px 16px; border-radius: 20px; }
          .carousel { margin: 0 -20px; }
          .carousel-wrapper { padding: 8px 20px; }
          .carousel-track { gap: 16px; }
        }
      `}</style>

      <div className="carousel-box">
        <div className="section-header">
          <h2 className="section-title">{title}</h2>
          {/* Chỉ gọi onViewMore nếu được truyền vào */}
          {onViewMore && <ViewMoreButton onClick={onViewMore} />}
        </div>

        <div className="carousel" data-has-prev={hasPrev} data-has-next={hasNext}>
          {hasPrev && (
            <button
              className="nav-btn left"
              onClick={() => setOffset(Math.max(0, offset - 1))}
            >
              <img src={PrevIcon} alt="Previous" style={{ width: 50, height: 50 }} />
            </button>
          )}

          {hasNext && (
            <button
              className="nav-btn right"
              onClick={() => setOffset(Math.min(maxOffset, offset + 1))}
            >
              <img src={NextIcon} alt="Next" style={{ width: 50, height: 50 }} />
            </button>
          )}

          <div className="carousel-wrapper" ref={wrapperRef}>
            <div
              className="carousel-track"
              style={{ transform: `translateX(-${offset * ITEM_TOTAL_WIDTH}px)` }}
            >
              {items.map(item => (
                <PlanCard key={item.id} item={item} type={type} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Carousel;
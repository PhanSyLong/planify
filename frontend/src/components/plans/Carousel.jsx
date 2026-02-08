// Carousel.jsx – full updated version

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import PlanCard from './PlanCard';
import ViewMoreButton from './ViewMoreButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import './Carousel.css';

const GAP = 18;

const Carousel = ({ title, items, type, onViewMore }) => {
  const [offset, setOffset] = useState(0);
  const [visibleCount, setVisibleCount] = useState(4);
  const [itemWidth, setItemWidth] = useState(240);
  const wrapperRef = useRef(null);
  const trackRef = useRef(null);

  useEffect(() => {
    const calculateLayout = () => {
      if (!wrapperRef.current || !trackRef.current || items.length === 0) return;

      const containerWidth = wrapperRef.current.offsetWidth;
      const firstCard = trackRef.current.querySelector('.plan-card');
      const measured = firstCard ? firstCard.offsetWidth : 240;

      setItemWidth(measured);
      const totalWidth = measured + GAP;
      const visible = Math.floor(containerWidth / totalWidth);
      setVisibleCount(Math.max(1, visible));
    };

    calculateLayout();

    const resizeObserver = new ResizeObserver(calculateLayout);
    if (wrapperRef.current) resizeObserver.observe(wrapperRef.current);

    // Re-measure after content loads
    const timer = setTimeout(calculateLayout, 150);

    return () => {
      resizeObserver.disconnect();
      clearTimeout(timer);
    };
  }, [items.length, items]); // depend on items to re-calc when data changes

  const maxOffset = Math.max(0, (items?.length ?? 0) - visibleCount);
  const hasPrev = offset > 0;
  const hasNext = offset < maxOffset;

  const handlePrevious = useCallback(() => {
    setOffset((prev) => Math.max(0, prev - 1));
  }, []);

  const handleNext = useCallback(() => {
    setOffset((prev) => Math.min(maxOffset, prev + 1));
  }, [maxOffset]);

  const trackStyle = useMemo(
    () => ({
      transform: `translateX(-${offset * (itemWidth + GAP)}px)`,
    }),
    [offset, itemWidth]
  );

  if (!items) {  // Not appearing only when items doesn't exists, not when there's no items
    return null;
  }

  return (
    <div className="carousel-box">
      <div className="section-header">
        <h3 className="section-title">{title}</h3>
        {onViewMore && items.length > visibleCount && (
          <ViewMoreButton onClick={onViewMore} />
        )}
      </div>

      <div className="carousel" data-has-prev={hasPrev} data-has-next={hasNext}>
        {hasPrev && (
          <button className="nav-btn left" onClick={handlePrevious} aria-label="Previous">
            <FontAwesomeIcon icon={faAngleLeft} size="2x" className="icon" />
          </button>
        )}

        {hasNext && (
          <button className="nav-btn right" onClick={handleNext} aria-label="Next">
            <FontAwesomeIcon icon={faAngleRight} size="2x" className="icon" />
          </button>
        )}

        <div className="carousel-wrapper" ref={wrapperRef}>
          <div className="carousel-track" ref={trackRef} style={trackStyle}>
            {items.map((item) => (
              <div key={item.id} style={{ flexShrink: 0 }}>
                <PlanCard item={item} type={type} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(Carousel);
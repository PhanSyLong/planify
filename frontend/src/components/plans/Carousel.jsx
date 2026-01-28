import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import PlanCard from './PlanCard';
import ViewMoreButton from './ViewMoreButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import './Carousel.css';

const CARD_WIDTH = 240;
const GAP = 18;
const ITEM_TOTAL_WIDTH = CARD_WIDTH + GAP;

const Carousel = ({ title, items, type, onViewMore }) => {
  const [offset, setOffset] = useState(0);
  const [visibleItems, setVisibleItems] = useState(5);
  const wrapperRef = useRef(null);

  // Calculate visible items
  useEffect(() => {
    const calculateVisible = () => {
      if (wrapperRef.current) {
        const width = wrapperRef.current.offsetWidth;
        const calculated = Math.floor(width / ITEM_TOTAL_WIDTH);
        setVisibleItems(Math.max(1, calculated));
      }
    };

    calculateVisible();

    const resizeObserver = new ResizeObserver(calculateVisible);
    if (wrapperRef.current) {
      resizeObserver.observe(wrapperRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  const maxOffset = useMemo(() => Math.max(0, items.length - visibleItems), [items.length, visibleItems]);
  const hasPrev = offset > 0;
  const hasNext = offset < maxOffset;

  const handlePrevious = useCallback(() => {
    setOffset(prev => Math.max(0, prev - 1));
  }, []);

  const handleNext = useCallback(() => {
    setOffset(prev => Math.min(maxOffset, prev + 1));
  }, [maxOffset]);

  const trackStyle = useMemo(() => ({
    transform: `translateX(-${offset * ITEM_TOTAL_WIDTH}px)`
  }), [offset]);

  if (!items) {  // Not appearing only when items doesn't exists, not when there's no items
    return null;
  }

  return (
    <div className="carousel-box">
      <div className="section-header">
        <h3 className="section-title">{title}</h3>
        {onViewMore && items.length > visibleItems && (
          <ViewMoreButton onClick={onViewMore} />
        )}
      </div>

      <div className="carousel" data-has-prev={hasPrev} data-has-next={hasNext}>
        {hasPrev && (
          <button
            className="nav-btn left"
            onClick={handlePrevious}
            aria-label="Previous"
          >
            <FontAwesomeIcon icon={faAngleLeft} size="2x" className="icon" />
          </button>
        )}

        {hasNext && (
          <button
            className="nav-btn right"
            onClick={handleNext}
            aria-label="Next"
          >
            <FontAwesomeIcon icon={faAngleRight} size="2x" className="icon" />
          </button>
        )}

        <div className="carousel-wrapper" ref={wrapperRef}>
          <div className="carousel-track" style={trackStyle}>
            {items.map((item) => (
              <PlanCard key={item.id} item={item} type={type} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(Carousel);
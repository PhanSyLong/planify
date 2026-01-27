import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import UserCard from './UserCard';
import ViewMoreButton from '../plans/ViewMoreButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import '../plans/Carousel.css';

const CARD_WIDTH = 180;
const GAP = 18;
const ITEM_TOTAL_WIDTH = CARD_WIDTH + GAP;

const UserCarousel = ({ title, users, onViewMore }) => {
  const [offset, setOffset] = useState(0);
  const [visibleItems, setVisibleItems] = useState(5);
  const wrapperRef = useRef(null);

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

  const maxOffset = useMemo(() => Math.max(0, users.length - visibleItems), [users.length, visibleItems]);
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

  if (!users || users.length === 0) {
    return null;
  }

  return (
    <div className="carousel-box">
      <div className="section-header">
        <h3 className="section-title">{title}</h3>
        {onViewMore && users.length > visibleItems && (
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
            {users.map((user) => (
              <UserCard key={user.id} user={user} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(UserCarousel);
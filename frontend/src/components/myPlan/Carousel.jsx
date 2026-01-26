import React, { useState, useEffect, useRef } from "react";
import PlanCard from "./PlanCard";
import ViewMoreButton from "./ViewMoreButton";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";

import "./Carousel.css";

const Carousel = ({ title, items, type, onViewMore }) => {
  const [offset, setOffset] = useState(0);
  const wrapperRef = useRef(null);
  const [visibleItems, setVisibleItems] = useState(5);

  const CARD_WIDTH = 240;  // Updated to match PlanCard.css width
  const GAP = 18;
  const ITEM_TOTAL_WIDTH = CARD_WIDTH + GAP;

  // Calculate how many cards fit in the container
  useEffect(() => {
    const calculateVisible = () => {
      if (wrapperRef.current) {
        const width = wrapperRef.current.offsetWidth;
        const calculated = Math.floor(width / ITEM_TOTAL_WIDTH);
        setVisibleItems(Math.max(1, calculated));
      }
    };

    calculateVisible();
    window.addEventListener("resize", calculateVisible);
    return () => window.removeEventListener("resize", calculateVisible);
  }, []);

  const maxOffset = Math.max(0, items.length - visibleItems);
  const hasPrev = offset > 0;
  const hasNext = offset < maxOffset;

  return (
    <div className="carousel-box">
      <div className="section-header">
        <h3 className="section-title">{title}</h3>
        {onViewMore && <ViewMoreButton onClick={onViewMore} />}
      </div>

      <div className="carousel" data-has-prev={hasPrev} data-has-next={hasNext}>
        {hasPrev && (
          <button
            className="nav-btn left"
            onClick={() => setOffset(Math.max(0, offset - 1))}
          >
            <FontAwesomeIcon icon={faAngleLeft} size="2x" />
          </button>
        )}

        {hasNext && (
          <button
            className="nav-btn right"
            onClick={() => setOffset(Math.min(maxOffset, offset + 1))}
          >
            <FontAwesomeIcon icon={faAngleRight} size="2x" />
          </button>
        )}

        <div className="carousel-wrapper" ref={wrapperRef}>
          <div
            className="carousel-track"
            style={{ transform: `translateX(-${offset * ITEM_TOTAL_WIDTH}px)` }}
          >
            {items.map((item) => (
              <PlanCard key={item.id} item={item} type={type} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Carousel;
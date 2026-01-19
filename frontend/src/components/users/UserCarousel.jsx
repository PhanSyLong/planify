import React, { useState, useEffect, useRef } from "react";
import UserCard from "./UserCard";
import ViewMoreButton from "../myPlan/ViewMoreButton"; // adjust path if needed

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";

import "../myPlan/Carousel.css"; // Reusing the same CSS

const UserCarousel = ({ title, users, onViewMore }) => {
  const [offset, setOffset] = useState(0);
  const wrapperRef = useRef(null);
  const [visibleItems, setVisibleItems] = useState(5);

  const CARD_WIDTH = 180;
  const GAP = 18;
  const ITEM_TOTAL_WIDTH = CARD_WIDTH + GAP;

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

  const maxOffset = Math.max(0, users.length - visibleItems);
  const hasPrev = offset > 0;
  const hasNext = offset < maxOffset;

  return (
    <div className="carousel-box">
      <div className="section-header">
        <h2 className="section-title">{title}</h2>
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
            {users.map((user) => (
              <UserCard key={user.id} user={user} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCarousel;
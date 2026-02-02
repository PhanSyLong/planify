import React, { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import httpPublic from '../../api/httpPublic';
import LikeButton from './LikeButton';
import './PlanCard.css';

const PlanCard = ({ item }) => {
  const location = useLocation();

  // Always redirect to the unified /plans/{id} route
  const planPath = useMemo(() => {
    return `/plans/${item.id}`;
  }, [item.id]);

  return (
    <div className="plan-card">
      <Link to={planPath} className="plan-card-link">
        <div className="card-image">
          {item.picture ? (
              <img src={`${httpPublic.defaults.baseURL}${item.picture}`} alt={item.title} />
            ) : (
              <div className="placeholder-image"></div>
            )}
        </div>
        <div className="card-info">
          <h3 className="plan-title">{item.title}</h3>
          <p className="plan-duration">{item.duration}</p>
        </div>
      </Link>

      <div className="like-button-wrapper">
        <LikeButton
          itemId={item.id}
          type='plan'
        />
      </div>
    </div>
  );
};

export default React.memo(PlanCard);
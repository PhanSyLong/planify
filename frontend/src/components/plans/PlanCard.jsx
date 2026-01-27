import React, { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import LikeButton from './LikeButton';
import './PlanCard.css';

const PlanCard = ({ item }) => {
  const location = useLocation();

  // Memoize the path calculation
  const planPath = useMemo(() => {
    const basePath = location.pathname.split('/')[1];
    const validParents = ['myplan', 'saved', 'commu'];
    const parent = validParents.includes(basePath) ? basePath : '';

    return parent ? `/${parent}/plans/${item.id}` : `/plans/${item.id}`;
  }, [location.pathname, item.id]);

  return (
    <div className="plan-card">
      <Link to={planPath} className="plan-card-link">
        <div className="card-image" />
        <div className="card-info">
          <h3 className="plan-title">{item.title}</h3>
          <p className="plan-duration">{item.duration}</p>
        </div>
      </Link>

      <div className="like-button-wrapper">
        <LikeButton itemId={item.id} />
      </div>
    </div>
  );
};

export default React.memo(PlanCard);
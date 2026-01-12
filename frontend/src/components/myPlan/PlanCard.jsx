import React from 'react';
import LikeButton from './LikeButton';
import './PlanCard.css';
import { Link, useLocation } from "react-router-dom";

const PlanCard = ({ item }) => {
  // Get current path to determine context
  const location = useLocation();
  const basePath = location.pathname.split('/')[1]; // "myplan", "saved", "commu", etc.

  // Map to valid parent routes
  const validParents = ['myplan', 'saved', 'commu'];
  const parent = validParents.includes(basePath) ? basePath : '';

  return (
    <div className="plan-card">
      <Link
        to={parent ? `/${parent}/plans/${item.id}` : `/plans/${item.id}`}
        className="plan-card-link"
      >
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

export default PlanCard;
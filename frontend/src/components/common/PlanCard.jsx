import React from "react";
import { Link } from "react-router-dom"; // Đảm bảo import này
import LikeButton from "./LikeButton";

const PlanCard = ({ item }) => {
  return (
    <>
      {/* Unified Card Styles */}
      <style jsx="true">{`
        .card {
          position: relative;
          width: 240px;
          flex-shrink: 0;
          background: white;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          transition: all 0.3s ease;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          cursor: pointer; /* Thêm để người dùng biết card clickable */
        }

        .card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        }

        .card-image {
          width: 100%;
          height: 140px;
          background: linear-gradient(135deg, #6366f1, #4f46e5);
        }

        .card-info {
          padding: 16px 20px;
          text-align: left;
        }

        .card-info h3 {
          margin: 0 0 6px 0;
          font-size: 18px;
          font-weight: 600;
          color: #1f2937;
        }

        .card-info p {
          margin: 0;
          color: #64748b;
          font-size: 14px;
          line-height: 1.4;
        }

        /* Để LikeButton không bị ảnh hưởng bởi Link */
        .card-content {
          display: block;
          color: inherit;
          text-decoration: none;
        }
      `}</style>

      {/* Card với Link bọc phần nội dung chính */}
      <div className="card">
        <Link to={`/plans/${item.id}`} className="card-content">
          <div className="card-image">
            <img 
              src={`http://localhost:8080/planify${encodeURI(item.picture)}`}
              onError={(e) => (e.target.style.display = "none")}
              alt={item.title || item.name} 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
          <div className="card-info">
            <h3>{item.title || item.name}</h3>
            <p>{item.duration || item.description || "No description available"}</p>
          </div>
        </Link>

        {/* LikeButton nằm ngoài Link để không bị navigate khi click */}
        <LikeButton itemId={item.id} />
      </div>
    </>
  );
};

export default PlanCard;
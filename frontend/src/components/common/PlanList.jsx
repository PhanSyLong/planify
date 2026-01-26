// src/components/common/PlanList.jsx
import React, { useState } from 'react';
import PlanCard from './PlanCard';

const PlanList = ({ initialPlans = [], defaultType = "plan" }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const items = Array.isArray(initialPlans) ? initialPlans : [];

  const filteredItems = items.filter((item) => {
    const search = searchTerm.toLowerCase();
    const text = (
      item?.name ||
      item?.username ||
      item?.fullName ||
      item?.displayName ||
      item?.title ||
      ''
    ).toLowerCase();
    return text.includes(search);
  });

  return (
    <>
      <style jsx="true">{`
        .planlist-wrapper {
          background: white;
          border-radius: 28px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
          margin: 40px auto;
          max-width: 1400px;
          overflow: hidden;
        }

        .planlist-container {
          padding: 40px 40px 60px;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
          flex-wrap: wrap;
          gap: 16px;
        }

        .title {
          font-size: 28px;
          font-weight: 700;
          color: #1e293b;
          margin: 0;
        }

        .search-box {
          position: relative;
          width: 360px;
          max-width: 100%;
        }

        .search-input {
          width: 100%;
          padding: 12px 48px 12px 20px;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          font-size: 16px;
          background: white;
          outline: none;
          transition: all 0.3s ease;
        }

        .search-input:focus {
          border-color: #6366f1;
          box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.15);
        }

        .search-icon {
          position: absolute;
          right: 16px;
          top: 50%;
          transform: translateY(-50%);
          width: 22px;
          height: 22px;
          color: #94a3b8;
          pointer-events: none;
        }

        /* ĐẸP NHƯ CAROUSEL – CĂN ĐỀU 2 BÊN */


        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 16px; /* Reduced from 24px for tighter spacing */
          /* Optional: justify-content: center; */ /* Uncomment if you want cards centered in the row */
        }

        .no-results {
          grid-column: 1 / -1;
          text-align: center;
          padding: 100px 20px;
          color: #64748b;
          font-size: 20px;
          font-weight: 500;
        }

        .plan-card-wrapper {
          transition: transform 0.35s ease;
        }

        .plan-card-wrapper:hover {
          transform: translateY(-12px);
        }

        @media (max-width: 768px) {
          .planlist-wrapper {
            margin: 20px 16px;
            border-radius: 20px;
          }
          .planlist-container {
            padding: 32px 20px 50px;
          }
          .grid-outer {
            margin: 0 -20px;
            padding: 0 20px;
          }
          .grid {
            gap: 16px; /* Keep consistent, or reduce to 12px if needed */
          }
        }
      `}</style>

      <div className="planlist-wrapper">
        <div className="planlist-container">
          <div className="header">
            <h1 className="title">All Plans</h1>

            <div className="search-box">
              <input
                type="text"
                placeholder="Tìm kiếm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>
          </div>

          {/* CĂN ĐỀU 2 BÊN NHƯ CAROUSEL */}
          <div className="grid-outer">
            <div className="grid">
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <div key={item.id} className="plan-card-wrapper">
                    <PlanCard
                      item={item}
                      type={item.type || defaultType}
                    />
                  </div>
                ))
              ) : (
                <div className="no-results">
                  {searchTerm
                    ? `Không tìm thấy kết quả cho "${searchTerm}"`
                    : 'Chưa có dữ liệu nào.'}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PlanList;
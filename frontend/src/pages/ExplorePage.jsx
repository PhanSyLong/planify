import React, { useState } from 'react';
import ExploreHeader from '../components/explore/ExploreHeader';
import ExploreTags from '../components/explore/ExploreTags';
import allPlans from '../data/allPlans';     // NEW: dùng data chung

import Carousel from "../components/common/Carousel.jsx";
import PlanList from "../components/common/PlanList.jsx";

const ExplorePage = () => {
  const [activeTab, setActiveTab] = useState('subject');
  const [pinnedTags, setPinnedTags] = useState([]);
  const [fullView, setFullView] = useState(null);

  const handlePinTag = (tag) => {
    if (!pinnedTags.includes(tag)) setPinnedTags([...pinnedTags, tag]);
  };

  const handleUnpinTag = (tag) => {
    setPinnedTags(pinnedTags.filter(t => t !== tag));
  };

  // Lọc chỉ những plan công khai
  const publicPlans = allPlans.filter(plan => plan.isPublic);

  // ================== CHẾ ĐỘ XEM TẤT CẢ ==================
  if (fullView) {
    return (
      <>
        <style>{`
          html, body, #root {
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100%;
            overflow-x: hidden;
          }

          #root {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
          }

          .explore-page {
            padding: 24px;
            background: #f8fafc;
            min-height: 100vh;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            display: block;
            margin: 0;
            padding-top: 24px !important;
          }

          @media (max-width: 768px) {
            .explore-page { padding: 16px; }
          }
        `}</style>

        <div className="explore-page">
          <div style={{ padding: '24px 40px 0', maxWidth: '1400px', margin: '0 auto' }}>
            <button
              onClick={() => setFullView(null)}
              style={{
                background: 'none',
                border: 'none',
                color: '#6366f1',
                fontSize: '18px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 0',
              }}
            >
              ← Quay lại khám phá
            </button>
            <h1 style={{ fontSize: '32px', fontWeight: '700', margin: '16px 0 40px', color: '#1e293b' }}>
              {fullView.title}
            </h1>
          </div>
          <PlanList initialPlans={fullView.items} />
        </div>
      </>
    );
  }

  // ================== TRẠNG THÁI BÌNH THƯỜNG ==================
  return (
    <>
      <style>{`
        html, body, #root {
          margin: 0;
          padding: 0;
          width: 100%;
          height: 100%;
          overflow-x: hidden;
        }

        #root {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        .explore-page {
          padding: 24px;
          background: #f8fafc;
          min-height: 100vh;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          display: block;
          margin: 0;
          padding-top: 24px !important;
        }

        /* Header */
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          flex-wrap: wrap;
          gap: 16px;
        }

        .search-bar {
          position: relative;
          flex: 1;
          max-width: 520px;
        }

        .search-bar input {
          width: 100%;
          padding: 14px 50px 14px 20px;
          font-size: 16px;
          border: 1px solid #e2e8f0;
          border-radius: 30px;
          outline: none;
          background: white;
        }

        .search-bar .search-icon {
          position: absolute;
          right: 16px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 20px;
          color: #94a3b8;
        }

        .main-tabs {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
        }

        .main-tabs button {
          padding: 12px 32px;
          border: none;
          background: #e0e7ff;
          color: #4338ca;
          font-weight: 600;
          border-radius: 30px;
          cursor: pointer;
          transition: all 0.3s;
        }

        .main-tabs button.active {
          background: #4f46e5;
          color: white;
        }

        /* Tags */
        .tags-box {
          background: white;
          border-radius: 16px;
          padding: 20px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.06);
          margin-bottom: 32px;
        }

        .pinned-tags {
          display: flex;
          gap: 12px;
          margin-bottom: 16px;
          flex-wrap: wrap;
        }

        .tags-container {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
        }

        .tag {
          background: #f1f5f9;
          color: #475569;
          padding: 10px 20px;
          border-radius: 30px;
          font-size: 14px;
          cursor: pointer;
          border: 1px solid #e2e8f0;
          transition: all 0.2s;
          user-select: none;
        }

        .tag:hover {
          background: #dbeafe;
          border-color: #93c5fd;
          color: #1e40af;
        }

        .tag.pinned {
          background: #4f46e5 !important;
          color: white !important;
          border: none !important;
          padding-right: 36px !important;
          position: relative;
        }

        .tag.pinned strong { font-weight: 700; }

        .unpin-btn {
          position: absolute;
          right: 8px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: white;
          font-size: 22px;
          cursor: pointer;
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
        }

        .unpin-btn:hover { background: rgba(255,255,255,0.2); }

        /* Section Header */
        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .view-more-btn {
          background: none;
          border: none;
          color: #4f46e5;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
        }

        .view-more-btn:hover {
          color: #4338ca;
          text-decoration: underline;
        }

        /* Carousel Box */
        .carousel-box {
          background: white;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
          margin-bottom: 32px;
          overflow: hidden;
          width: 100%;
        }

        .section-title {
          font-size: 22px;
          font-weight: 600;
          margin: 0 0 20px 0;
          color: #1e293b;
        }

        .carousel {
          position: relative;
          margin: 0 -24px;
        }

        .carousel-wrapper {
          overflow-x: auto;
          overflow-y: hidden;
          scroll-behavior: smooth;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
          padding: 8px 24px;
        }

        .carousel-wrapper::-webkit-scrollbar {
          display: none;
        }

        .carousel-track {
          display: flex;
          gap: 24px;
          padding: 8px 0;
          width: max-content;
          min-width: 100%;
          will-change: transform;
          transition: transform 0.5s cubic-bezier(0.32, 0.72, 0, 1);
        }

        /* Fade effects */
        .carousel::before,
        .carousel::after {
          content: '';
          position: absolute;
          top: 0;
          bottom: 0;
          width: 80px;
          pointer-events: none;
          z-index: 10;
          opacity: 0;
          transition: opacity 0.4s ease;
        }

        .carousel::before {
          left: 0;
          background: linear-gradient(to right, rgba(255,255,255,1), rgba(255,255,255,0));
        }

        .carousel::after {
          right: 0;
          background: linear-gradient(to left, rgba(255,255,255,1), rgba(255,255,255,0));
        }

        .carousel[data-has-prev="true"]::before { opacity: 1; }
        .carousel[data-has-next="true"]::after { opacity: 1; }

        /* Cards */
        .plan-card,
        .user-card {
          position: relative;
          width: 240px;
          flex-shrink: 0;
          background: white;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
          transition: all 0.3s ease;
        }

        .plan-card:hover,
        .user-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.15);
        }

        .plan-image,
        .user-image {
          width: 100%;
          height: 140px;
          background: linear-gradient(135deg, #6366f1, #4f46e5);
        }

        .plan-info {
          padding: 16px 20px;
          text-align: left;
        }

        .plan-info h3 {
          margin: 0 0 6px;
          font-size: 18px;
          font-weight: 600;
          color: #1f2937;
        }

        .plan-info p {
          margin: 0;
          color: #64748b;
          font-size: 14px;
        }

        /* Like button */
        .like-btn {
          position: absolute;
          bottom: 12px;
          right: 12px;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: white;
          border: none;
          box-shadow: 0 4px 12px rgba(0,0,0,0.18);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          z-index: 10;
        }

        .like-btn:hover {
          transform: translateY(-4px) scale(1.08);
        }

        .like-btn svg {
          width: 26px;
          height: 26px;
          fill: #94a3b8;
          transition: all 0.3s;
        }

        .like-btn.liked svg {
          fill: #ef4444;
          stroke: #ef4444;
          stroke-width: 2;
        }

        /* Nav buttons */
        .nav-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(0,0,0,0.7);
          color: white;
          border: none;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          font-size: 24px;
          cursor: pointer;
          z-index: 20;
          backdrop-filter: blur(12px);
          opacity: 0;
          pointer-events: none;
          transition: all 0.3s ease;
        }

        .nav-btn:hover {
          background: rgba(0,0,0,0.9);
          transform: translateY(-50%) scale(1.15);
        }

        .nav-btn.left { left: 16px; }
        .nav-btn.right { right: 16px; }

        .carousel[data-has-prev="true"] .nav-btn.left,
        .carousel[data-has-next="true"] .nav-btn.right {
          opacity: 1;
          pointer-events: all;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .explore-page { padding: 16px; }
          .carousel-box { padding: 20px; }
          .plan-card, .user-card { width: 200px; }
          .carousel-track { gap: 16px; }
          .carousel { margin: 0 -20px; }
          .carousel-wrapper { padding: 8px 20px; }
        }
      `}</style>

      <div className="explore-page">
        <ExploreHeader activeTab={activeTab} setActiveTab={setActiveTab} />

        <ExploreTags
          activeTab={activeTab}
          pinnedTags={pinnedTags}
          onPin={handlePinTag}
          onUnpin={handleUnpinTag}
        />

        <Carousel
          title="Kế hoạch nổi bật"
          items={publicPlans}
          type="plan"
          onViewMore={() => setFullView({
            title: 'Kế hoạch nổi bật',
            items: publicPlans
          })}
        />

        <Carousel
          title="Người dùng"
          items={publicPlans}
          type="teacher"
          onViewMore={() => setFullView({
            title: 'Tất cả người dùng',
            items: publicPlans
          })}
        />
      </div>
    </>
  );
};

export default ExplorePage;
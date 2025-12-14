import React, { useState } from 'react';
import allPlans from '../data/allPlans'; // NEW: dùng data chung
import Carousel from "../components/common/Carousel.jsx";
import PlanList from "../components/common/PlanList.jsx";

const MyPlanPage = () => {
  const [fullView, setFullView] = useState(null);

  // Giả lập user hiện tại (sau này lấy từ context/auth)
  const currentUserId = "user123";

  // Lọc kế hoạch của user hiện tại
  const myPlans = allPlans.filter(p => p.authorId === currentUserId);

  // Tạm thời không có lastOpened và status → bỏ filter cũ
  // Nếu sau này cần thì thêm field vào allPlans.js
  const recentlyOpened = myPlans; // tạm dùng tất cả
  const inProcess = myPlans;       // tạm dùng tất cả

  // === CHẾ ĐỘ XEM TẤT CẢ ===
  if (fullView) {
    return (
      <div style={{ background: '#f8fafc', minHeight: '100vh' }}>
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
            ← Quay lại
          </button>
          <h1 style={{ fontSize: '32px', fontWeight: '700', margin: '16px 0 40px', color: '#1e293b' }}>
            {fullView.title}
          </h1>
        </div>
        <PlanList initialPlans={fullView.items} defaultType="plan" />
      </div>
    );
  }

  // === TRẠNG THÁI BÌNH THƯỜNG ===
  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh' }}>
      <Carousel
        title="Recently opened"
        items={recentlyOpened}
        type="plan"
        onViewMore={() => setFullView({ title: 'Recently opened', items: recentlyOpened })}
      />
      <Carousel
        title="In Process"
        items={inProcess}
        type="plan"
        onViewMore={() => setFullView({ title: 'In Process', items: inProcess })}
      />
      <PlanList initialPlans={myPlans} defaultType="plan" />
    </div>
  );
};

export default MyPlanPage;
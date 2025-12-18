import React, { useState } from 'react';
import Carousel from "../components/common/Carousel.jsx";
import PlanList from "../components/common/PlanList.jsx";
import { jwtDecode } from 'jwt-decode';
import { usePlans } from '../context/PlanContext.jsx';

const MyPlanPage = () => {
  const [fullView, setFullView] = useState(null);
  const { plans } = usePlans();  // Toàn bộ plans

  // Lọc kế hoạch của user hiện tại
  const token = localStorage.getItem("accessToken");
  const decoded = jwtDecode(token);
  const currentUserId = decoded.userId;

  const myPlans = plans.filter(plan => plan.ownerId === currentUserId);

  // Tạm thời không có lastOpened và status → bỏ filter cũ
  // Nếu sau này cần thì thêm field vào allPlans.js
  const recentlyOpened = plans; // tạm dùng tất cả
  const inProcess = plans;       // tạm dùng tất cả

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
            ← Return
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
        title="Recently Opened"
        items={recentlyOpened}
        type="plan"
        onViewMore={() => setFullView({ title: 'Recently Opened', items: recentlyOpened })}
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
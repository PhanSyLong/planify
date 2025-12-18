import React, { useState } from 'react';
import allPlans from '../data/allPlans';       // NEW: dùng data chung
import Carousel from "../components/common/Carousel.jsx";
import PlanList from "../components/common/PlanList.jsx";

const SavedPage = () => {
  const [fullView, setFullView] = useState(null);

  // Tạm thời chưa có logic folder/save → dùng tất cả plan công khai làm dữ liệu đã save
  // Sau này thay bằng: savedPlans = allPlans.filter(plan => userSavedFolders.includes(plan.id))
  const savedPlans = allPlans.filter(plan => plan.isPublic); // tạm thời

  // === CHẾ ĐỘ XEM TẤT CẢ ===
  if (fullView) {
    return (
      <div className="saved-page">
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
        <PlanList initialPlans={fullView.items} defaultType={fullView.type || "plan"} />
      </div>
    );
  }

  // === TRẠNG THÁI BÌNH THƯỜNG ===
  return (
    <div className="saved-page">
      <Carousel
        title="English"
        items={savedPlans}
        type="plan"
        onViewMore={() => setFullView({ title: 'Tất cả kế hoạch English đã lưu', items: savedPlans, type: 'plan' })}
      />
      <Carousel
        title="Math"
        items={savedPlans}
        type="plan"
        onViewMore={() => setFullView({ title: 'Tất cả kế hoạch Math đã lưu', items: savedPlans, type: 'plan' })}
      />
      <Carousel
        title="Coding"
        items={savedPlans}
        type="plan"
        onViewMore={() => setFullView({ title: 'Tất cả kế hoạch Coding đã lưu', items: savedPlans, type: 'plan' })}
      />
    </div>
  );
};

export default SavedPage;
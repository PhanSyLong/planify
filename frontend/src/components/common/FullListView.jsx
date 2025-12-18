// src/components/common/FullListView.jsx
import React from 'react';
import PlanList from './PlanList';

const FullListView = ({ title, items, onBack }) => {
  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      {/* Header với nút back */}
      <div style={{
        padding: '24px 40px 0',
        maxWidth: '1400px',
        margin: '0 auto',
      }}>
        <button
          onClick={onBack}
          style={{
            background: 'none',
            border: 'none',
            color: '#6366f1',
            fontSize: '18px',
            fontWeight: '600',
            cursor: 'pointer',
            padding: '12px 0',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '8px',
          }}
        >
          ← Quay lại
        </button>

        <h1 style={{
          fontSize: '32px',
          fontWeight: '700',
          color: '#1e293b',
          margin: '0 0 32px 0',
        }}>
          {title}
        </h1>
      </div>

      {/* Dùng lại hoàn toàn PlanList có sẵn */}
      <PlanList initialPlans={items} />
    </div>
  );
};

export default FullListView;
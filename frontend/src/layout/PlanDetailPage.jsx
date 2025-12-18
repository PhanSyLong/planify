// src/pages/PlanDetailPage.jsx
//mock detail plan after click the card
import React from 'react';
import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from 'react';
import { getAllPlans } from '../api/plan.js';
import { usePlans } from '../context/planContext.jsx';
// import allPlans from "../data/allPlans"; // ← Quan trọng: dùng chung data

const PlanDetailPage = () => {
  const { id } = useParams();
  const planId = parseInt(id); // chuyển string → number
  const { plans } = usePlans();

  const plan = plans.find(p => p.id === planId);

  if (!plan) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 20px' }}>
        <h2>Không tìm thấy kế hoạch.</h2>
        <Link to="/" style={{ color: '#6366f1' }}>Quay lại trang chủ</Link>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px', maxWidth: '900px', margin: '0 auto' }}>
      {/* Nút quay lại đẹp hơn một chút */}
      <Link
        to="/commu"
        style={{
          color: '#6366f1',
          fontSize: '18px',
          fontWeight: '600',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '30px'
        }}
      >
        ← Quay lại
      </Link>

      <h1 style={{ fontSize: '36px', fontWeight: '700', margin: '0 0 16px' }}>
        {plan.title}
      </h1>

      <p style={{ fontSize: '18px', color: '#64748b', marginBottom: '30px' }}>
        Thời gian: {plan.duration || "Chưa xác định"}
      </p>

      <p style={{ fontSize: '16px', lineHeight: '1.7', whiteSpace: 'pre-wrap' }}>
        {plan.description || plan.info || "Chưa có mô tả chi tiết."}
      </p>

      {/* Phần stages/tasks – thành viên khác sẽ làm chi tiết sau */}
      {plan.stages && plan.stages.length > 0 ? (
        <div style={{ marginTop: '50px' }}>
          <h2 style={{ fontSize: '28px', marginBottom: '20px' }}>Các giai đoạn</h2>
          {plan.stages.map((stage, index) => (
            <div
              key={index}
              style={{
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '20px',
                marginBottom: '20px'
              }}
            >
              <h3 style={{ margin: '0 0 10px' }}>
                {stage.name} {stage.duration ? `(${stage.duration})` : ''}
              </h3>
              {stage.tasks && (
                <ul style={{ margin: '10px 0', paddingLeft: '20px' }}>
                  {stage.tasks.map((task, i) => (
                    <li key={i} style={{ margin: '8px 0' }}>{task}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div style={{ marginTop: '50px', color: '#64748b' }}>
          <h2>Các giai đoạn</h2>
          <p>Đang được phát triển thêm chi tiết...</p>
        </div>
      )}
    </div>
  );
};

export default PlanDetailPage;
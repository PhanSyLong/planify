// EditPlan.jsx
import React, { useState } from "react";
import EditPlanInfo from "./EditPlanInfo";
import PreviewModal from "../createPlan/PreviewModal";
import "./EditPlan.css";

const EditPlan = ({ plan, setPlan, onPreview, onSave, onCancel }) => {
  const [showPreview, setShowPreview] = useState(false);

  // Local state chỉ dùng để truyền vào EditPlanInfo, không sync liên tục
  const [localPlan, setLocalPlan] = useState(plan);

  const handlePreview = () => {
    setShowPreview(true);
    onPreview?.(); // nếu parent cần
  };

  const handleSave = (updatedPlan) => {
    setPlan(updatedPlan);     // Cập nhật plan thật ở parent
    onSave?.();               // Gọi callback nếu có (ví dụ lưu DB)
  };

  const handleCancel = () => {
    onCancel?.();             // Parent sẽ đóng edit mode, giữ nguyên plan cũ
  };

  const handleUpdateFromChild = (updatedPlan) => {
    setLocalPlan(updatedPlan); // Chỉ cập nhật local để preview
  };

  return (
    <div className="createplan-page">
      <div className="createplan-header">
        <h1>Edit Plan</h1>
      </div>

      <div className="createplan-content">
        <EditPlanInfo
          initialPlan={plan}              // Chỉ truyền initial một lần
          currentPlan={localPlan}         // Dùng để preview
          onPlanChange={handleUpdateFromChild}  // Khi thay đổi → chỉ cập nhật local
          onSave={handleSave}             // Khi nhấn Save → truyền lên parent
        />
      </div>

      <div className="createplan-actions">
        <button className="review-btn" onClick={handlePreview}>
          Preview
        </button>
        <button className="save-btn" onClick={() => handleSave(localPlan)}>
          Save
        </button>
        <button className="cancel-btn" onClick={handleCancel}>
          Cancel
        </button>
      </div>

      {showPreview && (
        <PreviewModal
          planData={localPlan}
          onClose={() => setShowPreview(false)}
        />
      )}
    </div>
  );
};

export default EditPlan;
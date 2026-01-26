// EditPlanInfo.jsx (hoặc PlanInfo.jsx như bạn đặt tên)
import React, { useState, useEffect } from "react";
import Stage from "../createPlan/Stage";
import "./EditPlanInfo.css";

const CATEGORIES = [
  "Study", "Work", "Personal", "Health", "Fitness", "Language", "Exam", "Project"
];

const EditPlanInfo = ({ initialPlan = {}, currentPlan, onPlanChange, onSave }) => {
  // Local state riêng cho edit - chỉ khởi tạo từ initialPlan một lần
  const [planTitle, setPlanTitle] = useState(initialPlan.title || '');
  const [planDescription, setPlanDescription] = useState(initialPlan.description || '');
  const [stages, setStages] = useState(
    initialPlan.stages && initialPlan.stages.length > 0
      ? initialPlan.stages.map(stage => ({ ...stage })) // deep copy để an toàn
      : [{ title: '', description: '', tasks: [] }]
  );
  const [selectedCategories, setSelectedCategories] = useState(initialPlan.categories || []);

  // Khi người dùng thay đổi → cập nhật local state + thông báo cho parent (chỉ để preview)
  const updatePlan = () => {
    const updatedPlan = {
      title: planTitle,
      description: planDescription,
      categories: selectedCategories,
      stages: stages.filter(stage =>
        stage.title || stage.description || (stage.tasks?.length > 0)
      )
    };
    onPlanChange?.(updatedPlan);
  };

  // Gọi updatePlan mỗi khi có thay đổi (nhưng KHÔNG lưu thật)
  useEffect(() => {
    updatePlan();
  }, [planTitle, planDescription, selectedCategories, stages]);

  const addStage = () => {
    setStages([...stages, { title: '', description: '', tasks: [] }]);
  };

  const updateStage = (index, updatedStage) => {
    const newStages = [...stages];
    newStages[index] = updatedStage;
    setStages(newStages);
  };

  const deleteStage = (index) => {
    if (stages.length > 1) {
      setStages(stages.filter((_, i) => i !== index));
    } else {
      alert("You must have at least one stage!");
    }
  };

  const toggleCategory = (category) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  return (
    <div className="planinfo-wrapper">
      {/* Title */}
      <div className="plan-title-card">
        <label>Title</label>
        <input
          type="text"
          placeholder="Enter plan title"
          className="plan-title-input"
          value={planTitle}
          onChange={(e) => setPlanTitle(e.target.value)}
        />
      </div>

      {/* Info Card */}
      <div className="planinfo-card">
        <div className="image-upload">
          <input type="file" accept="image/*" />
          <span>Upload Image</span>
        </div>

        <div className="planinfo-right">
          <div className="planinfo-field">
            <label>Description</label>
            <textarea
              placeholder="Describe your plan..."
              value={planDescription}
              onChange={(e) => setPlanDescription(e.target.value)}
            />
          </div>

          <div className="categories-section">
            <button
              className="categories-btn"
              onClick={(e) => {
                e.stopPropagation();
                // Toggle popup ở đây nếu cần
              }}
            >
              Categories ({selectedCategories.length})
            </button>
            {/* Popup categories bỏ qua cho gọn, hoặc giữ nguyên */}
          </div>
        </div>
      </div>

      {/* Stages */}
      <div className="stage-list">
        {stages.map((stage, index) => (
          <Stage
            key={index}
            stage={stage}
            updateStage={(updated) => updateStage(index, updated)}
            deleteStage={() => deleteStage(index)}
          />
        ))}

        <button className="add-stage-btn" onClick={addStage}>
          + Add Stage
        </button>
      </div>
    </div>
  );
};

export default EditPlanInfo;
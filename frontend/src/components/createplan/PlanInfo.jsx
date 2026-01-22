import React, { useState, useCallback, useRef } from "react";
import Stage from "./Stage";
import "./PlanInfo.css";

const CATEGORIES = [
  "Study",
  "Work",
  "Personal",
  "Health",
  "Fitness",
  "Language",
  "Exam",
  "Project"
];

const PlanInfo = ({ planData, updatePlanData }) => {
  const [showCategories, setShowCategories] = useState(false);
  const fileInputRef = useRef(null);

  const handleTitleChange = useCallback((e) => {
    updatePlanData({ title: e.target.value });
  }, [updatePlanData]);

  const handleDescriptionChange = useCallback((e) => {
    updatePlanData({ description: e.target.value });
  }, [updatePlanData]);

  const handleImageChange = useCallback((e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size should be less than 5MB");
        return;
      }

      if (!file.type.startsWith('image/')) {
        alert("Please select an image file");
        return;
      }

      updatePlanData({
        imageFile: file,
        imageUrl: URL.createObjectURL(file), 
      })
    }
  }, [updatePlanData]);

  const handleRemoveImage = useCallback((e) => {
    e.stopPropagation();
    updatePlanData({ imageUrl: null });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [updatePlanData]);

  const addStage = useCallback(() => {
    updatePlanData({
      stages: [...planData.stages, { title: '', description: '', tasks: [] }]
    });
  }, [planData.stages, updatePlanData]);

  const updateStage = useCallback((index, updatedStage) => {
    const newStages = [...planData.stages];
    newStages[index] = updatedStage;
    updatePlanData({ stages: newStages });
  }, [planData.stages, updatePlanData]);

  const deleteStage = useCallback((index) => {
    if (planData.stages.length > 1) {
      updatePlanData({
        stages: planData.stages.filter((_, i) => i !== index)
      });
    } else {
      alert("You must have at least one stage!");
    }
  }, [planData.stages, updatePlanData]);

  const toggleCategory = useCallback((category) => {
    const newCategories = planData.categories.includes(category)
      ? planData.categories.filter((c) => c !== category)
      : [...planData.categories, category];
    updatePlanData({ categories: newCategories });
  }, [planData.categories, updatePlanData]);

  return (
    <div className="planinfo-wrapper">
      {/* Plan Title */}
      <div className="plan-title-card">
        <label>Title</label>
        <input
          type="text"
          placeholder="Enter plan title"
          className="plan-title-input"
          value={planData.title}
          onChange={handleTitleChange}
        />
      </div>

      {/* Plan Info Card */}
      <div className="planinfo-card">
        {/* Image Upload */}
        <div className="image-upload" onClick={() => fileInputRef.current?.click()}>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onClick={(e) => e.stopPropagation()}  // Fix prompting twice
            onChange={handleImageChange}
          />
          {planData.imageUrl ? (
            <>
              <img src={planData.imageUrl} alt="Plan preview" className="image-preview" />
              <button className="image-remove-btn" onClick={handleRemoveImage}>
                ×
              </button>
            </>
          ) : (
            <div className="image-upload-label">
              <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21 15 16 10 5 21"/>
              </svg>
              <span>Upload Image</span>
            </div>
          )}
        </div>

        {/* Description + Categories */}
        <div className="planinfo-right">
          <div className="planinfo-field">
            <label>Description</label>
            <textarea
              placeholder="Describe your plan..."
              value={planData.description}
              onChange={handleDescriptionChange}
            />
          </div>

          <div className="categories-section">
            <button
              className="categories-btn"
              onClick={() => setShowCategories(!showCategories)}
            >
              {showCategories ? 'Hide Categories' : 'Select Categories'}
            </button>

            {showCategories && (
              <div className="categories-popup">
                {CATEGORIES.map((cat) => (
                  <span
                    key={cat}
                    className={`category-tag ${
                      planData.categories.includes(cat) ? "active" : ""
                    }`}
                    onClick={() => toggleCategory(cat)}
                  >
                    {cat}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stages */}
      <div className="stage-list">
        {planData.stages.map((stage, index) => (
          <Stage
            key={index}
            stage={stage}
            stageNumber={index + 1}
            updateStage={(updatedStage) => updateStage(index, updatedStage)}
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

export default PlanInfo;
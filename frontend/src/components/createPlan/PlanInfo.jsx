import React, { useState } from "react";
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

const PlanInfo = () => {
  const [planTitle, setPlanTitle] = useState('');
  const [planDescription, setPlanDescription] = useState('');
  const [stages, setStages] = useState([{ title: '', description: '', tasks: [] }]);
  const [showCategories, setShowCategories] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);

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
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  return (
    <div className="planinfo-wrapper">
      {/* Plan Title */}
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

      {/* Plan Info Card */}
      <div className="planinfo-card">
        {/* Image Upload */}
        <div className="image-upload">
          <input type="file" accept="image/*" />
          <span>Upload Image</span>
        </div>

        {/* Description + Categories */}
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
              onClick={() => setShowCategories(!showCategories)}
            >
              Categories
            </button>

            {showCategories && (
              <div className="categories-popup">
                {CATEGORIES.map((cat) => (
                  <span
                    key={cat}
                    className={`category-tag ${
                      selectedCategories.includes(cat) ? "active" : ""
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
        {stages.map((stage, index) => (
          <Stage
            key={index}
            stage={stage}
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
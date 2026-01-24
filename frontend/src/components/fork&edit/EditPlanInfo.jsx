import React, { useState, useEffect, useCallback } from 'react';
import Stage from '../createplan/Stage';
import './EditPlanInfo.css';

const CATEGORIES = [
  'Study', 'Work', 'Personal', 'Health', 'Fitness',
  'Language', 'Exam', 'Project'
];

const EditPlanInfo = ({ initialPlan = {}, onPlanChange }) => {
  const [planTitle, setPlanTitle] = useState(initialPlan.title || '');
  const [planDescription, setPlanDescription] = useState(initialPlan.description || '');
  const [stages, setStages] = useState(
    initialPlan.stages?.length > 0
      ? initialPlan.stages.map(stage => ({ ...stage }))
      : [{ title: '', description: '', tasks: [] }]
  );
  const [selectedCategories, setSelectedCategories] = useState(
    initialPlan.categories || []
  );

  // Update parent whenever state changes
  useEffect(() => {
    const updatedPlan = {
      title: planTitle,
      description: planDescription,
      categories: selectedCategories,
      stages: stages.filter(stage =>
        stage.title || stage.description || (stage.tasks?.length > 0)
      )
    };
    onPlanChange?.(updatedPlan);
  }, [planTitle, planDescription, selectedCategories, stages, onPlanChange]);

  const addStage = useCallback(() => {
    setStages(prev => [...prev, { title: '', description: '', tasks: [] }]);
  }, []);

  const updateStage = useCallback((index, updatedStage) => {
    setStages(prev => {
      const newStages = [...prev];
      newStages[index] = updatedStage;
      return newStages;
    });
  }, []);

  const deleteStage = useCallback((index) => {
    setStages(prev => {
      if (prev.length > 1) {
        return prev.filter((_, i) => i !== index);
      }
      alert('You must have at least one stage!');
      return prev;
    });
  }, []);

  const toggleCategory = useCallback((category) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  }, []);

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
            <button className="categories-btn" type="button">
              Categories ({selectedCategories.length})
            </button>

            <div className="categories-popup">
              {CATEGORIES.map(cat => (
                <span
                  key={cat}
                  className={`category-tag ${selectedCategories.includes(cat) ? 'active' : ''}`}
                  onClick={() => toggleCategory(cat)}
                >
                  {cat}
                </span>
              ))}
            </div>
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

        <button
          className="add-stage-btn"
          onClick={addStage}
          type="button"
        >
          + Add Stage
        </button>
      </div>
    </div>
  );
};

export default React.memo(EditPlanInfo);
import React, { useState, useEffect, useCallback, useRef } from 'react';
import Stage from '../createplan/Stage';
import httpPublic from '../../api/httpPublic';
import './EditPlanInfo.css';

const TAG_GROUPS = {
  subject: [
    "Math", "Physics", "Chemistry", "Literature", "English",
    "Biology", "History", "Geography", "Computer Science"
  ],
  certificate: [
    "IELTS", "TOEIC", "VSTEP", "SAT", "IELTS UKVI", "TOPIK"
  ],
  other: [
    "Soft Skills", "Programming", "Design", "Marketing", "Foreign Languages"
  ],
};

const EditPlanInfo = ({ initialPlan = {}, onPlanChange }) => {
  const [planTitle, setPlanTitle] = useState(initialPlan.title || '');
  const [planDescription, setPlanDescription] = useState(initialPlan.description || '');
  const [planPicture, setPlanPicture] = useState(initialPlan.picture || null);
  const [imagePreview, setImagePreview] = useState(null);
  const [showCategories, setShowCategories] = useState(false);
  const [stages, setStages] = useState(
    initialPlan.stages?.length > 0
      ? initialPlan.stages.map(stage => ({ ...stage }))
      : [{ title: '', description: '', tasks: [] }]
  );
  const [selectedCategories, setSelectedCategories] = useState(
    initialPlan.categories || []
  );

  const fileInputRef = useRef(null);

  // Set initial image preview from existing plan picture
  useEffect(() => {
    if (initialPlan.picture && !imagePreview) {
      setImagePreview(`${httpPublic.defaults.baseURL}${initialPlan.picture}`);
    }
  }, [initialPlan.picture, imagePreview]);

  // Update parent whenever state changes
  useEffect(() => {
    const updatedPlan = {
      ...initialPlan,
      title: planTitle,
      description: planDescription,
      picture: planPicture,
      categories: selectedCategories,
      stages: stages.filter(stage =>
        stage.title || stage.description || (stage.tasks?.length > 0)
      )
    };
    onPlanChange?.(updatedPlan);
  }, [planTitle, planDescription, planPicture, selectedCategories, stages, onPlanChange, initialPlan]);

  const handleImageChange = useCallback((e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      // Store file for upload - the parent component will handle the actual upload
      setPlanPicture(file);
    }
  }, []);

  const handleImageClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const addStage = useCallback(() => {
    setStages(prev => [...prev, { tempId: crypto.randomUUID(), title: '', description: '', tasks: [] }]);
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
        <div className="image-upload" onClick={handleImageClick}>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{ display: 'none' }}
          />
          {imagePreview ? (
            <img
              src={imagePreview}
              alt="Plan preview"
              className="image-preview"
            />
          ) : (
            <>
              <div className="upload-placeholder">
                <span className="upload-icon">📷</span>
                <span>Click to upload image</span>
              </div>
            </>
          )}
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
              type="button"
              onClick={() => setShowCategories(!showCategories)}
            >
              {showCategories ? 'Hide Categories' : 'Select Categories'}
              {selectedCategories.length > 0 && ` (${selectedCategories.length})`}
            </button>

            {showCategories && (
              <div className="categories-popup">
                {Object.entries(TAG_GROUPS).map(([groupName, tags]) => (
                  <div key={groupName} className="tag-group">
                    <div className="tag-group-title">{groupName}</div>
                    <div className="tag-group-items">
                      {tags.map(tag => (
                        <button
                          key={tag}
                          type="button"
                          className={`category-tag ${selectedCategories.includes(tag) ? 'active' : ''}`}
                          onClick={() => toggleCategory(tag)}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
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
            key={stage.id || stage.tempId || index}
            stage={stage}
            stageNumber={index + 1}
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
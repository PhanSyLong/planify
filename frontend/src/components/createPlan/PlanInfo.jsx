import React, { useState } from "react";
import Stage from "./Stage";

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
  const [stages, setStages] = useState([0]);
  const [showCategories, setShowCategories] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const addStage = () => {
    setStages([...stages, stages.length]);
  };

  const toggleCategory = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  return (
    <>
      <style>{`
        .planinfo-wrapper {
          width: 100%;
        }

        /* Title card */
        .plan-title-card {
          background: #ffffff;
          border-radius: 20px;
          padding: 24px;
          margin-bottom: 24px;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
          display: flex;
          flex-direction: column;
        }

        .plan-title-card label {
          font-size: 16px;
          font-weight: 700;
          margin-bottom: 8px;
        }

        .plan-title-input {
          font-size: 22px;
          padding: 14px;
          border-radius: 12px;
          border: 1px solid #ccc;
          outline: none;
        }

        /* Info card */
        .planinfo-card {
          display: flex;
          gap: 24px;
          background: #ffffff;
          border-radius: 20px;
          padding: 24px;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
          margin-bottom: 32px;
        }

        /* Image input */
        .image-upload {
          width: 180px;
          height: 180px;
          border: 2px dashed #ccc;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          position: relative;
          text-align: center;
        }

        .image-upload input {
          opacity: 0;
          position: absolute;
          width: 100%;
          height: 100%;
          cursor: pointer;
        }

        .image-upload span {
          font-size: 14px;
          color: #666;
        }

        /* Right side */
        .planinfo-right {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .planinfo-field {
          display: flex;
          flex-direction: column;
          margin-bottom: 16px;
        }

        .planinfo-field label {
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 6px;
        }

        .planinfo-field textarea {
          resize: none;
          min-height: 100px;
          padding: 12px;
          border-radius: 10px;
          border: 1px solid #ccc;
          font-size: 14px;
          outline: none;
        }

        /* Categories */
        .categories-section {
          position: relative;
        }

        .categories-btn {
          padding: 10px 14px;
          background-color: #4e085f;
          color: #ffffff;
          border: none;
          border-radius: 10px;
          font-size: 14px;
          cursor: pointer;
          width: fit-content;
        }

        .categories-popup {
          margin-top: 12px;
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .category-tag {
          padding: 8px 14px;
          border-radius: 20px;
          border: 1px solid #4e085f;
          font-size: 13px;
          cursor: pointer;
          color: #4e085f;
          user-select: none;
        }

        .category-tag.active {
          background-color: #4e085f;
          color: #ffffff;
        }

        /* Stages */
        .stage-list {
          margin-top: 24px;
        }

        .add-stage-btn {
          margin-top: 20px;
          padding: 12px 18px;
          background-color: #153677;
          color: #ffffff;
          border: none;
          border-radius: 12px;
          font-size: 14px;
          cursor: pointer;
        }

        .add-stage-btn:hover {
          opacity: 0.9;
        }
      `}</style>

      <div className="planinfo-wrapper">
        {/* Plan Title */}
        <div className="plan-title-card">
          <label>Title</label>
          <input
            type="text"
            placeholder="Enter plan title"
            className="plan-title-input"
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
              <textarea placeholder="Describe your plan..." />
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
          {stages.map((_, index) => (
            <Stage key={index} />
          ))}

          <button className="add-stage-btn" onClick={addStage}>
            + Add Stage
          </button>
        </div>
      </div>
    </>
  );
};

export default PlanInfo;
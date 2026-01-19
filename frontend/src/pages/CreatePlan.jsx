//CreatePlan.jsx
import React, { useState } from "react";
import PlanInfo from "../components/createPlan/PlanInfo";
import PreviewModal from "../components/createPlan/PreviewModal";
import "./CreatePlan.css";

const CreatePlan = () => {
  const [showPreview, setShowPreview] = useState(false);
  const [planData, setPlanData] = useState({
    title: '',
    description: '',
    categories: [],
    stages: []
  });

  const handleCreate = () => {
    // Later:
    // - collect plan data
    // - send to backend
    // - redirect to MyPlan page
    console.log("Create plan");
  };

  const handlePreview = () => {
    // Collect all the plan data here
    // For demo purposes, using sample data
    setPlanData({
      title: 'Sample Plan Title',
      description: 'This is a sample description of the plan',
      categories: ['Study', 'Work'],
      stages: [
        {
          title: 'Stage 1',
          description: 'First stage description',
          tasks: [
            {
              title: 'Task 1',
              description: 'Task description',
              duration: '5',
              subtasks: ['Subtask 1', 'Subtask 2']
            }
          ]
        }
      ]
    });
    setShowPreview(true);
  };

  return (
    <div className="createplan-page">
      {/* Page Header */}
      <div className="createplan-header">
        <h1>Create New Plan</h1>
      </div>

      {/* Main Content */}
      <div className="createplan-content">
        <PlanInfo />
      </div>

      {/* Action Buttons */}
      <div className="createplan-actions">
        <button className="review-btn" onClick={handlePreview}>
          Preview
        </button>
        <button className="create-btn" onClick={handleCreate}>
          Create
        </button>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <PreviewModal planData={planData} onClose={() => setShowPreview(false)} />
      )}
    </div>
  );
};

export default CreatePlan;
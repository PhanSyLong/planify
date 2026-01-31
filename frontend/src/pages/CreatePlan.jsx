import React, { useState, useCallback } from "react";
import PlanInfo from "../components/createplan/PlanInfo";
import PreviewModal from "../components/createplan/Preview";
import "./CreatePlan.css";

const CreatePlan = () => {
  const [showPreview, setShowPreview] = useState(false);
  const [planData, setPlanData] = useState({
    title: '',
    description: '',
    categories: [],
    stages: [{ title: '', description: '', tasks: [] }],
    imageUrl: null
  });

  const handleCreate = useCallback(() => {
    // Validate plan data
    if (!planData.title.trim()) {
      alert("Please enter a plan title");
      return;
    }

    // TODO: Send to backend
    console.log("Create plan with data:", planData);

    // TODO: Redirect to MyPlan page
  }, [planData]);

  const handlePreview = useCallback(() => {
    if (!planData.title.trim()) {
      alert("Please enter a plan title before previewing");
      return;
    }
    setShowPreview(true);
  }, [planData.title]);

  const updatePlanData = useCallback((updates) => {
    setPlanData(prev => ({ ...prev, ...updates }));
  }, []);

  return (
    <div className="createplan-page">
      {/* Page Header */}
      <div className="createplan-header">
        <h1>Create New Plan</h1>
      </div>

      {/* Main Content */}
      <div className="createplan-content">
        <PlanInfo planData={planData} updatePlanData={updatePlanData} />
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
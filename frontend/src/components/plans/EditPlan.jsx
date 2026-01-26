import React, { useState, useCallback } from 'react';
import EditPlanInfo from './EditPlanInfo';
import PreviewModal from '../createplan/Preview';
import './EditPlan.css';

const EditPlan = ({ plan, setPlan, onPreview, onSave, onCancel }) => {
  const [showPreview, setShowPreview] = useState(false);
  const [localPlan, setLocalPlan] = useState(plan);

  const handlePreview = useCallback(() => {
    setShowPreview(true);
    onPreview?.();
  }, [onPreview]);

  const handleSave = useCallback(() => {
    setPlan(localPlan);
    onSave?.();
  }, [localPlan, setPlan, onSave]);

  const handleCancel = useCallback(() => {
    onCancel?.();
  }, [onCancel]);

  const handleUpdateFromChild = useCallback((updatedPlan) => {
    setLocalPlan(updatedPlan);
  }, []);

  const handleClosePreview = useCallback(() => {
    setShowPreview(false);
  }, []);

  return (
    <div className="createplan-page">
      <div className="createplan-header">
        <h1>Edit Plan</h1>
      </div>

      <div className="createplan-content">
        <EditPlanInfo
          initialPlan={plan}
          currentPlan={localPlan}
          onPlanChange={handleUpdateFromChild}
        />
      </div>

      <div className="createplan-actions">
        <button className="review-btn" onClick={handlePreview}>
          Preview
        </button>
        <button className="save-btn" onClick={handleSave}>
          Save
        </button>
        <button className="cancel-btn" onClick={handleCancel}>
          Cancel
        </button>
      </div>

      {showPreview && (
        <PreviewModal
          planData={localPlan}
          onClose={handleClosePreview}
        />
      )}
    </div>
  );
};

export default React.memo(EditPlan);
import React from "react";
import PlanInfo from "../components/createPlan/PlanInfo";

const CreatePlan = () => {
  const handleCreate = () => {
    // Later:
    // - collect plan data
    // - send to backend
    // - redirect to MyPlan page
    console.log("Create plan");
  };

  const handleReview = () => {
    // Later:
    // - open Preview page / modal
    console.log("Review plan");
  };

  return (
    <>
      <style>{`
        .createplan-page {
          width: 100%;
          padding: 24px 32px 60px;
        }

        /* Header */
        .createplan-header {
          margin-bottom: 24px;
        }

        .createplan-header h1 {
          font-size: 28px;
          font-weight: 700;
          color: #002765;
        }

        /* Content */
        .createplan-content {
          max-width: 1100px;
        }

        /* Actions */
        .createplan-actions {
          position: sticky;
          bottom: 0;
          background: #ffffff;
          padding: 16px 0;
          margin-top: 40px;
          display: flex;
          justify-content: flex-end;
          gap: 16px;
          border-top: 1px solid #eee;
        }

        .review-btn {
          padding: 12px 22px;
          background-color: #edeef0;
          color: #333;
          border: none;
          border-radius: 12px;
          font-size: 14px;
          cursor: pointer;
        }

        .create-btn {
          padding: 12px 26px;
          background-color: #153677;
          color: #ffffff;
          border: none;
          border-radius: 12px;
          font-size: 14px;
          cursor: pointer;
        }

        .create-btn:hover,
        .review-btn:hover {
          opacity: 0.9;
        }
      `}</style>

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
          <button className="review-btn" onClick={handleReview}>
            Review
          </button>
          <button className="create-btn" onClick={handleCreate}>
            Create
          </button>
        </div>
      </div>
    </>
  );
};

export default CreatePlan;
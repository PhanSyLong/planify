import React from "react";
import PlanInfo from "../components/createPlan/PlanInfo";
import { useState } from "react";
import { createPlan } from "../api/plan";
import { uploadImage } from "../api/image";
import { useNavigate } from "react-router-dom";

const CreatePlan = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [pictureFile, setPicture] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const navigate = useNavigate();

  const handleCreate = async () => {
    console.log("Create plan");
    console.log("Title:", title);
    console.log("Description:", description);
    console.log("Picture:", pictureFile);

    try {
      let picture = null;
      if (pictureFile){
        const imgResponse = await uploadImage(pictureFile);
        picture = imgResponse.data.result;
        console.log("Uploaded picture path:", picture);
      }

      if (!title) {
        alert("Title is required");
        return;
      }

      const response = await createPlan({
        title, 
        description, 
        visibility: "private",
        status: "incompleted",
        duration: 0,
        picture
      });

      console.log("Plan created:", response.data);
      navigate("/plan");
    
    } catch (error) {
      console.error("Error creating plan:", error);
    }
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
          <PlanInfo
              title={title}
              setTitle={setTitle}
              description={description}
              setDescription={setDescription}
              picture={pictureFile}
              setPicture={setPicture}
              previewUrl={previewUrl}
              setPreviewUrl={setPreviewUrl}
          />
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
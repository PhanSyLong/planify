import { useState, useCallback } from "react";
import PlanInfo from "../components/createplan/PlanInfo";
import PreviewModal from "../components/createplan/Preview";
import { createPlan } from "../api/plan";
import { uploadImage } from "../api/image";
import { useNavigate } from "react-router-dom";
import { usePlans } from "../context/PlanContext.jsx";

import "./CreatePlan.css";

const CreatePlan = () => {
    const [planData, setPlanData] = useState({
        title: '',
        description: '',
        categories: [],
        visibility: 'private',
        status: 'incompleted',
        duration: 0,
        stages: [{title: '', description: '', tasks: []}],
        imageFile: null,
        imageUrl: null
    });
    const [showPreview, setShowPreview] = useState(false);
    const { addPlan } = usePlans();
    const navigate = useNavigate();

    // Generic updater
    const updatePlanData = useCallback((updates) => {
        setPlanData((prev) => ({
            ...prev,
            ...updates,
        }));
    }, []);

    const handleCreate = useCallback( async() => {
        const { title, description, imageFile} = planData;

        if (!title.trim()) {
            alert("Please enter a plan title");
            return;
        }

        try {
            let imageUrl = null;
            if (imageFile) {
                const imgResponse = await uploadImage(imageFile);
                imageUrl = imgResponse.data.result;
                console.log("Uploaded picture path:", imageUrl);
            }
            console.log(imageUrl)
            const response = await createPlan({
                title: title,
                description: description,
                picture: imageUrl,
                duration: planData.duration,
                status: planData.status,
                visibility: planData.visibility
            });

            addPlan(response.data.result)
            navigate(`/plans/${response.data.result.id}`);

            console.log("Create plan with data:", planData);

        } catch (error) {
            console.error("Error creating plan:", error);
        }
    }, [planData, navigate]);

    const handlePreview = useCallback(() => {
        if (!planData.title.trim()) {
            alert("Please enter a plan title before previewing");
            return;
        }
        setShowPreview(true);
    }, [planData.title]);

    return (
        <div className="createplan-page">
            {/* Page Header */}
            <div className="createplan-header">
                <h1>Create New Plan</h1>
            </div>

            {/* Main Content */}
            <div className="createplan-content">
                <PlanInfo
                    planData={planData}
                    updatePlanData={updatePlanData}
                />
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
                <PreviewModal planData={planData} onClose={() => setShowPreview(false)}/>
            )}
        </div>
    );
};

export default CreatePlan;
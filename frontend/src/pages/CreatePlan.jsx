import { useState, useCallback } from "react";
import PlanInfo from "../components/createplan/PlanInfo";
import PreviewModal from "../components/createplan/Preview";
import { createPlan } from "../api/plan";
import { createTask } from "../api/task";
import { createSubtask } from "../api/subtask";
import { uploadImage } from "../api/image";
import { useNavigate } from "react-router-dom";
import { usePlans } from "../context/PlanContext.jsx";

import "./CreatePlan.css";
import { createStage } from "../api/stage.js";

const CreatePlan = () => {
    const [planData, setPlanData] = useState({
        title: '',
        description: '',
        categories: [],
        visibility: 'private',
        status: 'incompleted',
        duration: 0,
        imageFile: null,
        reviewUrl: '',
        stages: [{
            tempId: crypto.randomUUID(),
            planId: crypto.randomUUID(),
            title: '',
            description: '',
            tasks: [{
                tempId: crypto.randomUUID(),
                stageId: crypto.randomUUID(),
                // title: '',
                description: '',
                subtasks: [
                    {
                    tempId: crypto.randomUUID(),
                    taskId: crypto.randomUUID(),
                    title: '',
                    description: '',
                    duration: 0,
                    status: 'incompleted',
                    daysLeft: 0,
                    startedAt: '',
                    completedAt: '',
                    }
                ],
            }],
        }],
    });
    const [showPreview, setShowPreview] = useState(false);
    const { addPlan, hydratePlan } = usePlans();
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
            let reviewUrl = null;
            if (imageFile) {
                const imgResponse = await uploadImage(imageFile);
                reviewUrl = imgResponse.data.result;
                console.log("Uploaded picture path:", reviewUrl);
            }
            
            const planResponse = await createPlan({
                title: title,
                description: description,
                picture: reviewUrl,
                duration: planData.duration,
                status: planData.status,
                visibility: planData.visibility
            });

            const planId = planResponse.data.result.id;

            const stageResponses = await Promise.all(
                planData.stages.map(stage =>
                    createStage({
                        planId: planId,
                        title: stage.title,
                        description: stage.description,
                    })
                )
            );

            const stageIdMap = {};
            planData.stages.forEach((stage, index) => {
                stageIdMap[stage.tempId] = stageResponses[index].data.result.id;
            });

            const taskEntries = [];
            planData.stages.forEach(stage => {
                stage.tasks.forEach(task => {
                    taskEntries.push({ stageTempId: stage.tempId, task});
                });
            });

            const taskResponses = await Promise.all(
            taskEntries.map(({ stageTempId, task }) => {
                return createTask({
                    stageId: stageIdMap[stageTempId],
                    // title: task.title,
                    description: task.title,
                });
            })
            );

            
            const taskIdMap = {};
            taskEntries.forEach((entry, index) => {
                taskIdMap[entry.task.tempId] = taskResponses[index].data.result.id;
            });


            const subtaskEntries = [];
            planData.stages.forEach(stage => 
                stage.tasks.forEach(task =>
                    task.subtasks.forEach(subtask =>
                        subtaskEntries.push({ taskTempId: task.tempId, subtask})
                    )
                )
            );
            const subtaskResponses = await Promise.all(
                subtaskEntries.map(({ taskTempId, subtask }) =>
                    createSubtask({
                        taskId: taskIdMap[taskTempId],
                        title: subtask.title,
                        description: subtask.description,
                        duration: parseInt(subtask.duration, 10) || 0,
                        status: subtask.status || 'incompleted',
                    })
                )
            );

            const fullPlan = await hydratePlan(planId);  // Combine subfields
            addPlan(fullPlan);
            console.log("Created plan with data:", fullPlan);

            navigate(`/plans/${planId}`);

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
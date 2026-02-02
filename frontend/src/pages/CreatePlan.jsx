import { useState, useCallback } from "react";
import PlanInfo from "../components/createplan/PlanInfo";
import PreviewModal from "../components/createplan/Preview";
import { createPlan } from "../api/plan";
import { createTask } from "../api/task";
import { createSubtask } from "../api/subtask";
import { uploadImage } from "../api/image";
import { setTagsForPlan } from "../api/tag";
import { useNavigate } from "react-router-dom";

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

            // Create stages sequentially to preserve user-entered order
            const stageResponses = [];
            for (const stage of planData.stages) {
                const resp = await createStage({
                    planId: planId,
                    title: stage.title,
                    description: stage.description,
                });
                stageResponses.push(resp);
            }

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

            // Create tasks sequentially to preserve ordering
            const taskResponses = [];
            for (const entry of taskEntries) {
                const resp = await createTask({
                    stageId: stageIdMap[entry.stageTempId],
                    // title: entry.task.title,
                    description: entry.task.description,
                });
                taskResponses.push(resp);
            }

            const taskIdMap = {};
            taskEntries.forEach((entry, index) => {
                taskIdMap[entry.task.tempId] = taskResponses[index].data.result.id;
            });

            // Process subtasks sequentially per task to avoid deadlock
            // Group subtasks by task
            const subtasksByTask = new Map();
            planData.stages.forEach(stage =>
                stage.tasks.forEach(task => {
                    if (task.subtasks && task.subtasks.length > 0) {
                        const taskId = taskIdMap[task.tempId];
                        if (!subtasksByTask.has(taskId)) {
                            subtasksByTask.set(taskId, []);
                        }
                        subtasksByTask.get(taskId).push(...task.subtasks);
                    }
                })
            );

            // Create subtasks for each task sequentially to prevent concurrent lock contention
            for (const [taskId, subtasks] of subtasksByTask.entries()) {
                const validSubtasks = subtasks.filter(sub => sub.title && sub.title.trim());
                if (validSubtasks.length > 0) {
                    // Create subtasks sequentially to avoid concurrent updates to the same task row
                    for (const subtask of validSubtasks) {
                        await createSubtask({
                            taskId: taskId,
                            title: subtask.title,
                            description: subtask.description || '',
                            duration: parseInt(subtask.duration, 10) || 0,
                            status: subtask.status || 'incompleted',
                        });
                    }
                }
            }
            // Save tags for the plan
            if (planData.categories && planData.categories.length > 0) {
                try {
                    await setTagsForPlan(planId, planData.categories);
                    console.log("Saved tags for plan:", planData.categories);
                } catch (tagError) {
                    console.error("Error saving tags:", tagError);
                }
            }

            console.log("Created plan with data:", planData);

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
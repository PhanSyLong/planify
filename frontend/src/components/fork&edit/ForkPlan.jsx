import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PlanInfo from "../createplan/PlanInfo";
import PreviewModal from "../createplan/Preview";
import { useHydratedPlan } from '../../queries/useHydratedPlan';
import { createPlan, addForkRecord } from '../../api/plan.js';
import { createStage } from "../../api/stage.js";
import { createTask } from "../../api/task";
import { createSubtask } from "../../api/subtask";
import { uploadImage } from "../../api/image";
import httpPublic from '../../api/httpPublic.js';

import './ForkPlan.css';


const ForkPlan = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [toasts, setToasts] = useState([]);
  const { data: fullPlan, isLoading } = useHydratedPlan(id);
  const [originalPlan, setOriginalPlan] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [planData, setPlanData] = useState({
        title: '',
        description: '',
        categories: [],
        visibility: 'private',
        status: 'incompleted',
        duration: 0,
        imageFile: null,
        reviewUrl: '',
        stages: [],
    });
    
  const addToast = (type, message) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, type, message }]);
  
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };
    
  // Load original plan and pre-fill form
  useEffect(() => {
    const loadOriginalPlan = async () => {
      try {
        if (!fullPlan) {
          alert('Plan not found');
          navigate('/plans', { replace: true });
          return;
        }
        setOriginalPlan(fullPlan);

        // Pre-fill with a copy, but change title to indicate it's a fork
        setPlanData({
          ...fullPlan,
          title: `Copy of ${fullPlan.title}`,
          reviewUrl: `${httpPublic.defaults.baseURL}${fullPlan.picture}`,
        });
      } catch (err) {
        console.error(err);
        alert('Failed to load plan');
        navigate(-1);
      }
    };

    if (id) loadOriginalPlan();
  }, [id, navigate]);

  const handleCreate = useCallback( async() => {  // Nearly the same as CreatePlan.jsx
    const { title, description, imageFile} = planData;
      if (!title.trim()) {
        alert("Please enter a plan title");
        return;
      }

      try {
        let reviewUrl = fullPlan.picture;
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

        addForkRecord(id, planData.id);
        console.log("Forked plan created: ", planData);
        console.log("Original plan ID: ", id);
        
        addToast("success", `Forking successful!`);
        navigate('/myplan'); // or wherever your user's plans are listed
    
      } catch (err) {
        console.error("Fork error: ", err);
        addToast("error",
          err.response?.data?.message || err.message || "Forking failed!"
        );
      }

  }, [planData, id, navigate, fullPlan]);

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

  if (isLoading) {
    return (
      <div className="createplan-page">
        <div className="viewplan-loading">
          <p>Loading plan to fork...</p>
        </div>
      </div>
    );
  }

  return (
    <>
    {/* Toast notifications */}
      <div className="toasts">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast ${toast.type}`}>
            {toast.message}
          </div>
        ))}
      </div>
    <div className="createplan-page">
      <div className="createplan-header">

        {originalPlan && (
          <div className="fork-notice">
            Creating your personal copy of <strong>"{originalPlan.title}"</strong>
          </div>
        )}
      </div>

      <div className="createplan-content">
        <PlanInfo planData={planData} updatePlanData={updatePlanData} />
      </div>

      <div className="createplan-actions">
        <button className="review-btn" onClick={handlePreview}>
          Preview
        </button>
        <button className="create-btn" onClick={handleCreate}>
          Fork Plan
        </button>
      </div>

      {showPreview && (
        <PreviewModal
          planData={planData}
          onClose={() => setShowPreview(false)}
        />
      )}
    </div>
    </>
  );
};

export default ForkPlan;
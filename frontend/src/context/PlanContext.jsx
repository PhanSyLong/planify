import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getPlanById, getAllPlans } from "../api/plan";
import { getStagesByPlanId } from "../api/stage"
import { getTasksByPlanId } from "../api/task";
import { getSubtasksByPlanId } from "../api/subtask";
import { getTagsByPlanId } from "../api/tag";
import { authApi } from "../api/auth";

const PlanContext = createContext();

export function PlansProvider({ children }) {
  const [plans, setPlans] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        console.log("Getting all plans");

        const res = await getAllPlans();
        // console.log("All unhydrated plans:", res.data.result);

        const plans = await Promise.all(
          res.data.result.map(plan => hydratePlan(plan.id))
        );

        // console.log("Hydrated plans:", plans);
        setPlans(plans);
      } catch (err) {
        if (err?.response?.status === 401) {
          if (localStorage.accessToken) {
            console.log("User session expired");
          } else {
            console.log("No token found");
          }
          authApi.logout();
          navigate('/');
        } else {
          console.error("Error fetching plans:", err);
        }
      }
    };

    fetchPlans();
  }, []);

  const addPlan = (newPlan) => {
    setPlans(prevPlans => [...prevPlans, newPlan]);
  };

  const getCachedPlanById = (id) => {
    return plans.find((plan) => plan.id === Number(id));
  };

  const hydratePlan = async (planId) => {
    const [
      planRes,
      stagesRes,
      tasksRes,
      subtasksRes,
      tagsRes
    ] = await Promise.all([
      getPlanById(planId),
      getStagesByPlanId(planId),
      getTasksByPlanId(planId),
      getSubtasksByPlanId(planId),
      getTagsByPlanId(planId)
    ]);

    const plan = planRes.data.result;
    const stages = stagesRes.data.result;
    const tasks = tasksRes.data.result;
    const subtasks = subtasksRes.data.result;
    const tags = tagsRes.data?.result || [];

    // Grouping subtasks to tasks
    const subtasksByTaskId = subtasks.reduce((acc, subtask) => {
      (acc[subtask.taskId] ??= []).push(subtask);
      return acc;
    }, {});

    // Grouping tasks to stages
    const tasksByStageId = tasks.reduce((acc, task) => {
      (acc[task.stageId] ??= []).push({
        ...task,
        subtasks: subtasksByTaskId[task.id] ?? []
      });
      return acc;
    }, {});

    // Attaching tasks to stages
    const hydratedStages = stages.map(stage => ({
      ...stage,
      tasks: tasksByStageId[stage.id] ?? []
    }));

    // Attaching stages and tags to plan
    return {
      ...plan,
      stages: hydratedStages,
      categories: tags
    };
  };

  return (
    <PlanContext.Provider value={{ plans, addPlan, getCachedPlanById, hydratePlan }}>
      {children}
    </PlanContext.Provider>
  );
}

export function usePlans() {
  return useContext(PlanContext);
}

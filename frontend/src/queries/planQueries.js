import { getPlanById, getForkOrigin } from "../api/plan"; 
import { getStagesByPlanId } from "../api/stage"
import { getTasksByPlanId } from "../api/task";
import { getSubtasksByPlanId } from "../api/subtask";

export const hydratePlan = async (planId) => {
	const [
	  planRes, 
	  stagesRes,
	  tasksRes,
	  subtasksRes
	] = await Promise.all([
	  getPlanById(planId),
	  getStagesByPlanId(planId),
	  getTasksByPlanId(planId),
	  getSubtasksByPlanId(planId)
	]);

	const plan = planRes.data.result;
	const stages = stagesRes.data.result;
	const tasks = tasksRes.data.result;
	const subtasks = subtasksRes.data.result;

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

	// Attaching stages to plan
	return {
	  ...plan,
	  stages: hydratedStages
	};
};
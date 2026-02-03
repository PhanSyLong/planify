import { getPlanById } from "../api/plan"; 
import { getStagesByPlanId } from "../api/stage"
import { getTasksByPlanId } from "../api/task";
import { getSubtasksByPlanId } from "../api/subtask";
import { getTagsByPlanId } from "../api/tag";

export const hydratePlan = async (planId) => {
	const [
	  planRes, 
	  stagesRes,
	  tasksRes,
	  subtasksRes,
	  tagRes,
	] = await Promise.all([
	  getPlanById(planId),
	  getStagesByPlanId(planId),
	  getTasksByPlanId(planId),
	  getSubtasksByPlanId(planId),
	  getTagsByPlanId(planId),
	]);

	const plan = planRes.data.result;
	const stages = stagesRes.data.result;
	const tasks = tasksRes.data.result;
	const subtasks = subtasksRes.data.result;
	const tags = tagRes.data.result;

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
	  categories: tags,
	};
};
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import StatusDropdown from "./StatusDropdown";
import { getTodoList, updateSubtask } from "../../api/subtask";
import "./ToDo.css";

export default function ToDo() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      setLoading(false);
      return;
    }

    getTodoList(userId)
      .then((res) => {
        const items = res.data?.result || [];
        const grouped = groupAndSortTasks(items);
        setPlans(grouped);
      })
      .catch((err) => {
        console.error("Failed to fetch todo list:", err);
        setError("Failed to load to-do list");
      })
      .finally(() => setLoading(false));
  }, []);

  /**
   * Groups todo items by plan and sorts:
   * - Plans by the minimum daysLeft (ascending)
   * - Subtasks within each plan by scheduledDate (ascending via daysLeft)
   */
  function groupAndSortTasks(items) {
    // Group by planId
    const planMap = items.reduce((acc, item) => {
      const planId = item.planId || 0;
      if (!acc[planId]) {
        acc[planId] = {
          planId,
          planName: item.planTitle || "Unknown Plan",
          minDaysLeft: item.daysLeft ?? Infinity,
          tasks: [],
        };
      }
      acc[planId].tasks.push(item);
      // Track minimum daysLeft for sorting plans
      if (item.daysLeft != null && item.daysLeft < acc[planId].minDaysLeft) {
        acc[planId].minDaysLeft = item.daysLeft;
      }
      return acc;
    }, {});

    // Convert to array and sort
    const planArray = Object.values(planMap);

    // Sort plans by minDaysLeft ascending
    planArray.sort((a, b) => a.minDaysLeft - b.minDaysLeft);

    // Sort tasks within each plan by daysLeft ascending
    planArray.forEach((plan) => {
      plan.tasks.sort((a, b) => (a.daysLeft ?? Infinity) - (b.daysLeft ?? Infinity));
    });

    return planArray;
  }

  // Implement later
  // async function updateTaskStatus(subtaskId, newStatus) {
  //   // Optimistic update
  //   setPlans((prev) =>
  //     prev.map((plan) => ({
  //       ...plan,
  //       tasks: plan.tasks.map((task) =>
  //         task.subtaskId === subtaskId ? { ...task, status: newStatus } : task
  //       ),
  //     }))
  //   );

  //   try {
  //     await updateSubtask(subtaskId, { status: newStatus });
  //   } catch (err) {
  //     console.error("Failed to update subtask status:", err);
  //     // Revert on error - refetch could be done here
  //   }
  // }

  if (loading) {
    return (
      <section className="todo">
        <h3 className="todo-title">To do list</h3>
        <p>Loading...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="todo">
        <h3 className="todo-title">To do list</h3>
        <p className="todo-error">{error}</p>
      </section>
    );
  }

  if (plans.length === 0) {
    return (
      <section className="todo">
        <h3 className="todo-title">To do list</h3>
        <p className="todo-empty">No tasks to show. Start a subtask to see it here!</p>
      </section>
    );
  }

  return (
    <section className="todo">
      <h3 className="todo-title">To do list</h3>

      {plans.map((plan) => (
        <div className="todo-plan" key={plan.planId}>
          <Link to={`/plans/${plan.planId}`} className="todo-plan__header">
            Plan: {plan.planName}
          </Link>

          <ul className="todo-list">
            {plan.tasks.map((task) => (
              <li className="todo-item" key={task.subtaskId}>
                <span className="todo-text">• {task.title}</span>

                {/* Implement later */}
                {/* <StatusDropdown
                  value={task.status}
                  onChange={(newStatus) =>
                    updateTaskStatus(task.subtaskId, newStatus)
                  }
                /> */}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
}

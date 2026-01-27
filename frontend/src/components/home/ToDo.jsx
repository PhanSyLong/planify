import React, { useEffect, useState } from "react";
import StatusDropdown from "./StatusDropdown";
import "./ToDo.css";

/* =========================
   MOCK DATA
   ========================= */
const MOCK_TASKS = [
  {
    id: 1,
    title: "Subtask này dài 1 dòng thôi",
    status: "INCOMPLETE",
    plan: { id: 1, name: "Plan A" },
  },
  {
    id: 2,
    title: "Subtask này dài 2 dòng mksjdzm,zskmnksm,xm",
    status: "CANCELLED",
    plan: { id: 1, name: "Plan A" },
  },
  {
    id: 3,
    title: "Subtask này dài 1 dòng thôi",
    status: "IN_PROGRESS",
    plan: { id: 2, name: "Plan B" },
  },
];

export default function ToDo() {
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    groupTasks(MOCK_TASKS);
  }, []);

  function groupTasks(tasks) {
    const grouped = Object.values(
      tasks.reduce((acc, task) => {
        if (!acc[task.plan.id]) {
          acc[task.plan.id] = {
            planId: task.plan.id,
            planName: task.plan.name,
            tasks: [],
          };
        }
        acc[task.plan.id].tasks.push(task);
        return acc;
      }, {})
    );
    setPlans(grouped);
  }

  function updateTaskStatus(taskId, newStatus) {
    setPlans((prev) =>
      prev.map((plan) => ({
        ...plan,
        tasks: plan.tasks.map((task) =>
          task.id === taskId
            ? { ...task, status: newStatus }
            : task
        ),
      }))
    );

    /* 🔌 Backend later
    fetch(`/api/tasks/${taskId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    */
  }

  return (
    <section className="todo">
      <h3 className="todo-title">To do list</h3>

      {plans.map((plan) => (
        <div className="todo-plan" key={plan.planId}>
          <div className="todo-plan__header">
            Plan: {plan.planName}
          </div>

          <ul className="todo-list">
            {plan.tasks.map((task) => (
              <li className="todo-item" key={task.id}>
                <span className="todo-text">
                  • {task.title}
                </span>

                <StatusDropdown
                  value={task.status}
                  onChange={(newStatus) =>
                    updateTaskStatus(task.id, newStatus)
                  }
                />
              </li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
}

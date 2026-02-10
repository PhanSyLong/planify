import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import StatusDropdown from "./StatusDropdown";
import { getTodoList, updateSubtask, completeSubtask } from "../../api/subtask";
import { recordSubtaskDone, recordSubtaskCancel } from "../../api/dailyPerformance";
import "./ToDo.css";

export default function ToDo() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirmModal, setConfirmModal] = useState({
    visible: false,
    type: null, // 'done' or 'cancel'
    subtaskId: null,
    planId: null,
    newStatus: null
  });

  const fetchTodoList = useCallback(() => {
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

  useEffect(() => {
    fetchTodoList();
  }, [fetchTodoList]);

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

  // Check if a subtask is overdue (scheduledDate is in the past and status is incomplete)
  function isOverdue(task) {
    if (!task.scheduledDate || task.status !== 'incompleted') return false;
    const scheduled = new Date(task.scheduledDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return scheduled < today;
  }

  // Normalize status for display
  function normalizeStatus(status) {
    if (status === 'completed') return 'DONE';
    if (status === 'cancelled') return 'CANCELLED';
    if (status === 'incompleted') return 'INCOMPLETE';
    return status || 'INCOMPLETE';
  }

  // Check if subtask is finished
  function isFinished(status) {
    return status === 'completed' || status === 'cancelled' ||
      status === 'DONE' || status === 'CANCELLED';
  }

  // Handle status change with confirmation
  function handleStatusChange(subtaskId, planId, newStatus) {
    if (newStatus === 'DONE' || newStatus === 'CANCELLED') {
      setConfirmModal({
        visible: true,
        type: newStatus === 'DONE' ? 'done' : 'cancel',
        subtaskId,
        planId,
        newStatus
      });
    }
  }

  // Confirm the status change
  async function handleConfirm() {
    const { type, subtaskId, planId, newStatus } = confirmModal;

    // Optimistic update
    setPlans((prev) =>
      prev.map((plan) => ({
        ...plan,
        tasks: plan.tasks.map((task) =>
          task.subtaskId === subtaskId
            ? { ...task, status: newStatus === 'DONE' ? 'completed' : 'cancelled' }
            : task
        ),
      }))
    );

    setConfirmModal({ visible: false, type: null, subtaskId: null, planId: null, newStatus: null });

    try {
      if (type === 'done') {
        await completeSubtask(subtaskId);
        await updateSubtask(subtaskId, { status: 'completed' });
        await recordSubtaskDone(planId);
      } else if (type === 'cancel') {
        await updateSubtask(subtaskId, { status: 'cancelled' });
        await recordSubtaskCancel(planId);
      }
    } catch (err) {
      console.error("Failed to update subtask status:", err);
      // Revert on error - refetch
      fetchTodoList();
    }
  }

  // Cancel the modal
  function handleCancelModal() {
    setConfirmModal({ visible: false, type: null, subtaskId: null, planId: null, newStatus: null });
  }

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
            {plan.tasks.map((task) => {
              const overdue = isOverdue(task);
              const finished = isFinished(task.status);
              const statusClass = task.status === 'completed' ? 'todo-item--completed'
                : task.status === 'cancelled' ? 'todo-item--cancelled'
                  : '';

              return (
                <li
                  className={`todo-item ${overdue ? 'todo-item--overdue' : ''} ${statusClass}`}
                  key={task.subtaskId}
                >
                  <span className="todo-text">• {task.title}</span>

                  <StatusDropdown
                    value={normalizeStatus(task.status)}
                    onChange={(newStatus) =>
                      handleStatusChange(task.subtaskId, task.planId, newStatus)
                    }
                    disabled={finished}
                  />
                </li>
              );
            })}
          </ul>
        </div>
      ))}

      {/* Confirmation Modal */}
      {confirmModal.visible && (
        <div className="todo-confirm-overlay">
          <div className="todo-confirm-modal">
            <h3>
              {confirmModal.type === 'done' ? 'Complete Subtask' : 'Cancel Subtask'}
            </h3>
            <p>
              {confirmModal.type === 'done'
                ? 'Are you sure you want to mark this subtask as done? This action cannot be undone.'
                : 'Are you sure you want to cancel this subtask? This action cannot be undone.'}
            </p>
            <div className="todo-confirm-actions">
              <button className="btn-confirm-no" onClick={handleCancelModal}>
                No, Go Back
              </button>
              <button
                className={`btn-confirm-yes ${confirmModal.type === 'cancel' ? 'cancel-action' : ''}`}
                onClick={handleConfirm}
              >
                {confirmModal.type === 'done' ? 'Yes, Complete' : 'Yes, Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

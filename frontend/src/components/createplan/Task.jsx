import React, { useCallback, useMemo } from "react";
import Subtask from "./Subtask";
import "./Task.css";

const Task = ({ task, taskNumber, updateTask, deleteTask }) => {
  const handleDescriptionChange = useCallback((e) => {
    updateTask({ ...task, description: e.target.value });
  }, [task, updateTask]);

  const handleSubtasksChange = useCallback((newSubtasks) => {
    // Tính duration mới = tổng của tất cả subtasks
    const totalDuration = newSubtasks.reduce(
      (sum, sub) => sum + Number(sub.duration || 0),
      0
    );

    updateTask({
      ...task,
      subtasks: newSubtasks,
      duration: totalDuration,           // tự động cập nhật
    });
  }, [task, updateTask]);

  // Hoặc dùng useMemo nếu muốn hiển thị mà không lưu vào state
  const computedDuration = useMemo(() => {
    if (!task.subtasks || !Array.isArray(task.subtasks)) return 0;
    return task.subtasks.reduce((sum, sub) => sum + Number(sub?.duration || 0), 0);
  }, [task.subtasks]);

  return (
    <div className="task-wrapper">
      <div className="task-header">
        <h3>Task {taskNumber}</h3>
        <button className="delete-task-btn" onClick={deleteTask}>
          Delete Task
        </button>
      </div>

      <div className="task-card">
        <div className="task-field">
          <label>Title</label>
          <input
            type="text"
            placeholder="Enter task title"
            value={task.description || ""}
            onChange={handleDescriptionChange}
          />
        </div>

        {/* Duration của task: hiển thị tổng, có thể read-only */}
        <div className="task-field duration-field">
          <label>Duration</label>
          <div className="duration-input">
            <input
              type="number"
              value={computedDuration}           // hoặc task.duration nếu bạn lưu
              readOnly
              disabled
            />
            <span className="duration-unit">days</span>
          </div>
        </div>
      </div>

      <Subtask
        subtasks={task.subtasks || []}
        setSubtasks={handleSubtasksChange}
      />
    </div>
  );
};

export default Task;
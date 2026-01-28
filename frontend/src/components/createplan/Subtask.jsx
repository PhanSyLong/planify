import React, { useState, useCallback } from "react";
import "./Subtask.css";

const Subtask = ({ subtasks, setSubtasks }) => {
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newDuration, setNewDuration] = useState("");

  const addSubtask = useCallback(() => {
    const title = newTitle.trim();
    if (!title) {
      alert("Please enter a subtask title!");
      return;
    }

    const duration = newDuration.trim() === "" ? 0 : parseInt(newDuration.trim(), 10) || 0;

    const newItem = {
      title,
      description: newDescription.trim(),
      duration,
      status: '',
    };

    setSubtasks([...subtasks, newItem]);
    setNewTitle("");
    setNewDescription("");
    setNewDuration("");
  }, [newTitle, newDescription, newDuration, subtasks, setSubtasks]);

  const removeSubtask = useCallback(
    (index) => {
      setSubtasks(subtasks.filter((_, i) => i !== index));
    },
    [subtasks, setSubtasks]
  );

  const updateSubtask = useCallback(
    (index, field, value) => {
      setSubtasks(
        subtasks.map((item, i) =>
          i === index ? { ...item, [field]: value } : item
        )
      );
    },
    [subtasks, setSubtasks]
  );

  return (
    <div className="subtask-section">
      <h4>Subtasks</h4>

      {/* Add new subtask form */}
      <div className="subtask-add-form">
        <div className="subtask-field">
          <label>Subtask Title</label>
          <input
            type="text"
            placeholder="Subtask title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
        </div>

        <div className="subtask-field">
          <label>Description (optional)</label>
          <textarea
            placeholder="Description"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            rows={3}
          />
        </div>

        <div className="subtask-field duration-field">
          <label>Duration (days)</label>
          <div className="duration-input">
            <input
              type="number"
              min="0"
              placeholder="0"
              value={newDuration}
              onChange={(e) => setNewDuration(e.target.value)}
            />
            <span className="duration-unit">days</span>
          </div>
        </div>

        <button className="subtask-add-btn" onClick={addSubtask}>
          Add Subtask
        </button>
      </div>

      {/* List of subtasks – không hiển thị total nữa */}
      {subtasks.length > 0 && (
        <div className="subtask-list">
          {subtasks.map((sub, index) => (
            <div key={index} className="subtask-item">
              <div className="subtask-header">
                <div className="subtask-title">{sub.title}</div>
                <button
                  className="subtask-remove-btn"
                  onClick={() => removeSubtask(index)}
                  aria-label="Remove subtask"
                >
                  ×
                </button>
              </div>

              {sub.description && (
                <div className="subtask-description">{sub.description}</div>
              )}

              <div className="subtask-duration">
                <span className="duration-label">Duration:</span>
                <input
                  type="number"
                  min="0"
                  value={sub.duration}
                  onChange={(e) =>
                    updateSubtask(index, "duration", e.target.value)
                  }
                />
                <span className="duration-unit">days</span>
              </div>
            </div>
          ))}
          {/* Đã xóa phần total-duration ở đây */}
        </div>
      )}
    </div>
  );
};

export default Subtask;
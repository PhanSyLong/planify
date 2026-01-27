import React, { useState, useCallback } from "react";
import "./Subtask.css";

const Subtask = ({ subtasks, setSubtasks }) => {
  const [inputValue, setInputValue] = useState("");

  const addTask = useCallback(() => {
    const trimmedValue = inputValue.trim();
    if (trimmedValue === "") {
      alert("Please enter a subtask!");
      return;
    }

    setSubtasks([...subtasks, trimmedValue]);
    setInputValue("");
  }, [inputValue, subtasks, setSubtasks]);

  const removeTask = useCallback((indexToRemove) => {
    setSubtasks(subtasks.filter((_, index) => index !== indexToRemove));
  }, [subtasks, setSubtasks]);

  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter') {
      addTask();
    }
  }, [addTask]);

  return (
    <div className="subtask-app">
      <h4>Subtasks</h4>

      <div className="subtask-input-row">
        <input
          type="text"
          placeholder="Add your subtask"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyUp={handleKeyPress}
          onKeyDown={handleKeyPress}
        />
        <button className="subtask-add-btn" onClick={addTask}>
          Add
        </button>
      </div>

      {subtasks.length > 0 && (
        <ul className="subtask-list">
          {subtasks.map((task, index) => (
            <li key={index} className="subtask-item">
              <span className="subtask-text">{task}</span>
              <button
                className="subtask-remove-btn"
                onClick={() => removeTask(index)}
                aria-label="Remove subtask"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Subtask;
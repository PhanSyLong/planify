import React, { useState } from "react";
import "./Subtask.css";

const Subtask = ({ subtasks, setSubtasks }) => {
  const [inputValue, setInputValue] = useState("");

  const addTask = () => {
    if (inputValue.trim() === "") {
      alert("You must write subtask!");
      return;
    }

    setSubtasks([...subtasks, inputValue]);
    setInputValue("");
  };

  const removeTask = (indexToRemove) => {
    setSubtasks(subtasks.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div>
      <div className="todo-app">
        <h2>Subtask</h2>

        <div className="row">
          <input
            type="text"
            placeholder="Add your subtask"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button onClick={addTask}>Add</button>
        </div>

        <ul>
          {subtasks.map((task, index) => (
            <li key={index}>
              {task}
              <span onClick={() => removeTask(index)}>&times;</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Subtask;
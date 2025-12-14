import React, { useState } from "react";

const Subtask = () => {
  const [inputValue, setInputValue] = useState("");
  const [subtasks, setSubtasks] = useState([]);

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
    <>
      <style>{`
        * {
          margin: 0;
          padding: 0;
          font-family: 'Poppins', sans-serif;
          box-sizing: border-box;
        }

        .todo-app {
          background: #ffffff;
          border-radius: 16px;
          padding: 20px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          margin-bottom: 24px;
        }

        .todo-app h2 {
          color: #002765;
          display: flex;
          align-items: center;
          margin-bottom: 20px;
        }

        .row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #edeef0;
          border-radius: 30px;
          padding-left: 20px;
          margin-bottom: 25px;
        }

        .row input {
          flex: 1;
          border: none;
          outline: none;
          background: transparent;
          padding: 10px;
          font-weight: 14px;
        }

        .row button {
          border: none;
          outline: none;
          padding: 16px 50px;
          background: #ff5945;
          color: #fff;
          font-size: 16px;
          cursor: pointer;
          border-radius: 40px;
        }

        .todo-app ul li {
          list-style: none;
          font-size: 17px;
          padding: 12px 8px 12px 50px;
          user-select: none;
          cursor: pointer;
          position: relative;
        }

        .todo-app ul li span {
          position: absolute;
          right: 0;
          top: 5px;
          width: 40px;
          height: 40px;
          font-size: 22px;
          color: #555;
          line-height: 40px;
          text-align: center;
          border-radius: 50%;
        }

        .todo-app ul li span:hover {
          background: #edeef0;
        }
      `}</style>

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
    </>
  );
};

export default Subtask;
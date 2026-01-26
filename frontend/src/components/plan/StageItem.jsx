import { useState } from 'react';
import TaskItem from './TaskItem';
import ChevronDown from '../../assets/icons/chevron-down.svg';
import ChevronRight from '../../assets/icons/chevron-right.svg';

export default function StageItem({ stage }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div style={{
      background: "white",
      borderRadius: "20px",
      overflow: "hidden",
      boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
      border: "1px solid #e2e8f0",
      marginBottom: "24px",
    }}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          background: "white",
          color: "#e2e8f0",
          padding: "20px 28px",
          fontSize: "1.6rem",
          fontWeight: "bold",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          cursor: "pointer",
          borderRadius: isOpen ? "20px 20px 0 0" : "20px",
        }}
      >
        <span>{stage.title}</span>
        {isOpen ? (
          <img src={ChevronDown} alt="down" style={{ width: "28px", height: "28px" }} />
        ) : (
          <img src={ChevronRight} alt="right" style={{ width: "28px", height: "28px" }} />
        )}
      </div>

      {isOpen && (
        <div style={{ padding: "28px", background: "#f8fafc" }}>
          <p style={{ marginBottom: "24px", color: "#4a5568", lineHeight: "1.6", fontSize: "1.1rem" }}>
            {stage.description}
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            {stage.tasks.map(task => <TaskItem key={task.id} task={task} />)}
          </div>
        </div>
      )}
    </div>
  );
}
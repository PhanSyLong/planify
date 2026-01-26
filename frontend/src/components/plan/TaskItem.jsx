import { useState } from 'react';
import ChevronDown from '../../assets/icons/chevron-down.svg';
import ChevronRight from '../../assets/icons/chevron-right.svg';

export default function TaskItem({ task }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={{
      background: "white",
      borderRadius: "16px",
      overflow: "hidden",
      border: "1px solid #e2e8f0",
      boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
    }}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          background: "white",
          color: "#e2e8f0",
          padding: "18px 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          cursor: "pointer",
          borderRadius: isOpen ? "16px 16px 0 0" : "16px",
        }}
      >
        <span style={{ fontWeight: "600", fontSize: "1.25rem" }}>
          {task.title}
        </span>

        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <span style={{
            background: "white",
            color: "#2d3748",
            padding: "8px 18px",
            borderRadius: "999px",
            fontWeight: "bold",
            fontSize: "0.95rem",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
          }}>
            {task.duration}
          </span>

          {isOpen ? (
            <img src={ChevronDown} alt="down" style={{ width: "24px", height: "24px" }} />
          ) : (
            <img src={ChevronRight} alt="right" style={{ width: "24px", height: "24px" }} />
          )}
        </div>
      </div>

      {isOpen && (
        <div style={{ padding: "24px", background: "#f7fafc", borderTop: "1px solid #e2e8f0" }}>
          <p style={{ marginBottom: "18px", color: "#4a5568", lineHeight: "1.6" }}>
            {task.description}
          </p>
          {task.subtasks?.length > 0 && (
            <div style={{
              marginLeft: "12px",
              paddingLeft: "20px",
              borderLeft: "4px solid #4299e1",
              display: "flex",
              flexDirection: "column",
              gap: "14px",
            }}>
              {task.subtasks.map((sub, idx) => (
                <div key={idx} style={{
                  background: "white",
                  padding: "16px",
                  borderRadius: "12px",
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                }}>
                  <strong style={{ color: "#2d3748", display: "block", marginBottom: "6px" }}>
                    {sub.title}
                  </strong>
                  <p style={{ color: "#718096", fontSize: "0.95rem", margin: 0 }}>
                    {sub.description}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
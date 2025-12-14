import React, { useState } from "react";

const STATUSES = [
  { label: "Done", value: "done" },
  { label: "Undone", value: "undone" },
  { label: "Cancel", value: "cancel" }
];

const StatusDropdown = ({ defaultStatus = "undone", onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(
    STATUSES.find((s) => s.value === defaultStatus) || STATUSES[1]
  );

  const handleSelect = (status) => {
    setSelected(status);
    setIsOpen(false);
    if (onChange) onChange(status.value);
  };

  return (
    <>
      <style>{`
        .status-dropdown {
          position: relative;
          display: inline-block;
        }

        /* Main button */
        .status-btn {
          padding: 8px 14px;
          border-radius: 30px;
          border: none;
          cursor: pointer;
          font-size: 13px;
          font-weight: 600;
        }

        /* Status colors */
        .status-btn.done {
          background-color: #2ecc71;
          color: #ffffff;
        }

        .status-btn.undone {
          background-color: #f1c40f;
          color: #ffffff;
        }

        .status-btn.cancel {
          background-color: #e74c3c;
          color: #ffffff;
        }

        /* Dropdown menu */
        .status-menu {
          position: absolute;
          top: 110%;
          left: 0;
          background: #ffffff;
          border-radius: 10px;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.12);
          overflow: hidden;
          z-index: 10;
        }

        .status-item {
          padding: 10px 14px;
          font-size: 13px;
          cursor: pointer;
        }

        .status-item:hover {
          background-color: #f5f5f5;
        }
      `}</style>

      <div className="status-dropdown">
        <button
          className={`status-btn ${selected.value}`}
          onClick={() => setIsOpen(!isOpen)}
          type="button"
        >
          {selected.label}
        </button>

        {isOpen && (
          <div className="status-menu">
            {STATUSES.map((status) => (
              <div
                key={status.value}
                className="status-item"
                onClick={() => handleSelect(status)}
              >
                {status.label}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default StatusDropdown;
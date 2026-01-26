import React from "react";
import "./StatusDropdown.css";

export default function StatusDropdown({
  value,
  onChange,
  disabled = false,
}) {
  return (
    <select
      className={`status-dropdown ${value.toLowerCase()}`}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      aria-label="Task status"
    >
      <option value="INCOMPLETE">Incomplete</option>
      <option value="IN_PROGRESS">In progress</option>
      <option value="DONE">Done</option>
      <option value="CANCELLED">Cancel</option>
    </select>
  );
}

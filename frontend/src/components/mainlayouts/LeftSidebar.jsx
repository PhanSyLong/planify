import { NavLink } from "react-router-dom";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faHouse,
  faListCheck,
  faBookmark,
  faUsers,
  faPlus,
  faCircleInfo,
} from "@fortawesome/free-solid-svg-icons";

export default function Sidebar() {
  const [expanded, setExpanded] = useState(false);

  const menuItems = [
    { label: "Home", icon: faHouse, path: "/" },
    { label: "My Plan", icon: faListCheck, path: "/myplan" },
    { label: "Saved", icon: faBookmark, path: "/saved" },
    { label: "Community", icon: faUsers, path: "/commu" },
    { label: "Add Plan", icon: faPlus, path: "/add" },
  ];

  const linkStyle = (isActive) => ({
    display: "flex",
    alignItems: "center",
    gap: "15px",
    textDecoration: "none",
    padding: "12px",
    margin: "4px 8px",
    borderRadius: "10px",
    background: isActive ? "#eee" : "transparent",
    color: isActive ? "#000" : "#555",
    whiteSpace: "nowrap",
  });

  const labelStyle = {
    whiteSpace: "nowrap",
    overflow: "hidden",
    transition: "all 0.2s ease",
    opacity: expanded ? 1 : 0,
    width: expanded ? "auto" : 0,
  };

  return (
    <aside
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      style={{
        width: expanded ? "200px" : "70px",
        transition: "width 0.25s ease",
        background: "#fff",
        borderRight: "1px solid #ddd",
        height: "calc(100vh - 70px)",
        position: "fixed",
        top: "70px",
        left: 0,
        display: "flex",
        zIndex: 1000,
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "10px 0",
        overflow: "hidden",
      }}
    >
      {/* TOP */}
      <div>
        {/* Toggle icon */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "12px",
            margin: "8px",
            borderRadius: "10px",
            color: "#555",
            fontSize: "20px",
          }}
        >
          <FontAwesomeIcon icon={faBars} />
        </div>

        {/* MENU */}
        <nav>
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              style={({ isActive }) => linkStyle(isActive)}
            >
              <FontAwesomeIcon
                icon={item.icon}
                style={{ fontSize: "20px", minWidth: "24px" }}
              />

              {/* ✅ ALWAYS RENDER LABEL */}
              <span style={labelStyle}>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* BOTTOM */}
      <NavLink to="/about" style={({ isActive }) => linkStyle(isActive)}>
        <FontAwesomeIcon
          icon={faCircleInfo}
          style={{ fontSize: "20px", minWidth: "24px" }}
        />
        <span style={labelStyle}>About Us</span>
      </NavLink>
    </aside>
  );
}

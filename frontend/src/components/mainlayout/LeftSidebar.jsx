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
import "./LeftSidebar.css";

export default function Sidebar() {
  const [expanded, setExpanded] = useState(false);

  const menuItems = [
    { label: "Home", icon: faHouse, path: "/home" },
    { label: "My Plan", icon: faListCheck, path: "/myplan" },
    { label: "Saved", icon: faBookmark, path: "/saved" },
    { label: "Community", icon: faUsers, path: "/commu" },
    { label: "Add Plan", icon: faPlus, path: "/add" },
  ];

  return (
    <aside
      className={`sidebar ${expanded ? "expanded" : ""}`}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      <div className="sidebar-top">
        <div className="sidebar-toggle">
          <FontAwesomeIcon icon={faBars} />
        </div>

        <nav>
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className="sidebar-link"
            >
              <FontAwesomeIcon icon={item.icon} />
              <span className="sidebar-label">{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      <NavLink to="/about" className="sidebar-link">
        <FontAwesomeIcon icon={faCircleInfo} />
        <span className="sidebar-label">About Us</span>
      </NavLink>
    </aside>
  );
}

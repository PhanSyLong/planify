import { NavLink } from "react-router-dom";
import { useState } from "react";

// Icons
import ToggleIcon from "../assets/icons/Toggle.svg";
import HomeIcon from "../assets/icons/Home.svg";
import PlanIcon from "../assets/icons/Plan.svg";
import SavedIcon from "../assets/icons/Saved.svg";
import CommuIcon from "../assets/icons/Commu.svg";
import AddIcon from "../assets/icons/Add.svg";
import AboutIcon from "../assets/icons/About.svg";

export default function Sidebar() {
  const [expanded, setExpanded] = useState(false);

  const menuItems = [
    { label: "Home", icon: HomeIcon, path: "/home" },
    { label: "My Plan", icon: PlanIcon, path: "/plan" },
    { label: "Saved", icon: SavedIcon, path: "/saved" },
    { label: "Community", icon: CommuIcon, path: "/commu" },
    { label: "Add Plan", icon: AddIcon, path: "/add" },
  ];

  return (
    <>
      {/* === CSS TOÀN BỘ SIDEBAR – ĐẶT TRONG FILE NÀY === */}
      <style jsx="true">{`
        .sidebar-active {
          background: #eef2ff !important;
          color: #4f46e5 !important;
          font-weight: 600 !important;
        }
        .sidebar-item:hover:not(.sidebar-active) {
          background: rgba(79, 70, 229, 0.08) !important;
        }
      `}</style>

      {/* === SIDEBAR === */}
      <aside
        onMouseEnter={() => setExpanded(true)}
        onMouseLeave={() => setExpanded(false)}
        style={{
          width: expanded ? "220px" : "70px",
          transition: "width 0.35s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.35s",
          background: "#fff",
          borderRight: "1px solid #e5e7eb",
          boxShadow: expanded ? "6px 0 25px rgba(0,0,0,0.1)" : "none",
          height: "calc(100vh - 70px)",
          position: "fixed",
          top: "70px",
          left: 0,
          overflow: "hidden",
          zIndex: 1000,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        {/* TOP SECTION */}
        <div>
          {/* Toggle Icon – BÂY GIỜ THẲNG HÀNG 100% */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "12px 16px",
              margin: "8px 8px 4px 8px",
            }}
          >
            <img src={ToggleIcon} alt="Menu" style={{ width: 24, height: 24, flexShrink: 0 }} />
          </div>

          {/* MENU ITEMS */}
          <nav style={{ marginTop: 8 }}>
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => (isActive ? "sidebar-active" : "") + " sidebar-item"}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "12px 16px",
                  margin: "4px 8px",
                  borderRadius: "12px",
                  color: "#555",
                  textDecoration: "none",
                  transition: "all 0.2s ease",
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                }}
              >
                <img
                  src={item.icon}
                  alt=""
                  style={{ width: 24, height: 24, flexShrink: 0 }}
                />
                <span
                  style={{
                    opacity: expanded ? 1 : 0,
                    transform: expanded ? "translateX(0)" : "translateX(12px)",
                    transition: "opacity 0.3s ease, transform 0.3s ease",
                    fontWeight: 500,
                    fontSize: "14.5px",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    flex: 1,
                    minWidth: 0,
                  }}
                >
                  {item.label}
                </span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* ABOUT */}
        <NavLink
          to="/about"
          className={({ isActive }) => (isActive ? "sidebar-active" : "") + " sidebar-item"}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "12px 16px",
            margin: "4px 8px 16px 8px",
            borderRadius: "12px",
            color: "#555",
            textDecoration: "none",
            transition: "all 0.2s ease",
            overflow: "hidden",
            whiteSpace: "nowrap",
          }}
        >
          <img src={AboutIcon} alt="" style={{ width: 24, height: 24, flexShrink: 0 }} />
          <span
            style={{
              opacity: expanded ? 1 : 0,
              transform: expanded ? "translateX(0)" : "translateX(12px)",
              transition: "opacity 0.3s ease, transform 0.3s ease",
              fontWeight: 500,
              fontSize: "14.5px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              flex: 1,
              minWidth: 0,
            }}
          >
            About Us
          </span>
        </NavLink>
      </aside>
    </>
  );
}
import { NavLink } from "react-router-dom";
import { useState } from "react";

// Icons
import Logo from "../assets/icons/Logo.svg";
import LanguageIcon from "../assets/icons/Language.svg";
import NotiIcon from "../assets/icons/Noti.svg";
import MyProfileIcon from "../assets/icons/Me.svg";
import SearchIcon from "../assets/icons/Search.svg";  // ⭐ your search icon

export default function Header() {
  const [searchValue, setSearchValue] = useState("");

  return (
    <header
      style={{
        height: "70px",
        width: "100%",
        background: "#0c4a6e",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 20px",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
      }}
    >
      {/* LEFT: LOGO */}
      <NavLink
        to="/"
        style={{ display: "flex", alignItems: "center", textDecoration: "none" }}
      >
        <img src={Logo} alt="Logo" style={{ height: 40 }} />
      </NavLink>

      {/* ⭐ MIDDLE: SEARCH BAR */}
      <div
        style={{
          flex: 1,                    // takes all middle space
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            position: "relative",
            width: "100%",
            maxWidth: "420px",        // Facebook-like width
          }}
        >
          {/* search icon */}
          <img
            src={SearchIcon}
            alt="Search"
            style={{
              width: 20,
              position: "absolute",
              top: "50%",
              left: "14px",
              transform: "translateY(-50%)",
              opacity: 0.7,
            }}
          />

          {/* input */}
          <input
            type="text"
            placeholder="Search..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 14px 10px 42px", // space for icon
              borderRadius: "20px",
              border: "none",
              outline: "none",
              fontSize: "15px",
              background: "#e1e7ec",
            }}
          />
        </div>
      </div>

      {/* RIGHT: ICONS */}
      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        <img src={LanguageIcon} alt="Language" style={{ width: 28, cursor: "pointer" }} />
        <img src={NotiIcon} alt="Notifications" style={{ width: 28, cursor: "pointer" }} />
        <img src={MyProfileIcon} alt="Profile" style={{ width: 28, cursor: "pointer" }} />
      </div>
    </header>
  );
}

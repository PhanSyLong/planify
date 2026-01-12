import { NavLink } from "react-router-dom";
import { useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faBell,
  faUser,
  faGlobe,
} from "@fortawesome/free-solid-svg-icons";

// Logo SVG
import Logo from "../../assets/images/Logo.svg";

// Import your NotificationDropdown component
// Adjust the path based on your folder structure
import NotificationDropdown from "../header/NotificationDropdown"; // ← change if needed
import LanguageDropdown from "../header/LanguageDropdown";

export default function Header() {
  const [searchValue, setSearchValue] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showLanguage, setShowLanguage] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('en'); // Default: 'en' for English

  // Refs for containers
  const bellContainerRef = useRef(null);
  const languageContainerRef = useRef(null);

  // Handler for language change (you can integrate with i18n library here)
  const handleChangeLanguage = (lang) => {
    setCurrentLanguage(lang);
    // Add your language switch logic here, e.g., i18n.changeLanguage(lang);
  };

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
        style={{
          display: "flex",
          alignItems: "center",
          textDecoration: "none",
        }}
      >
        <img src={Logo} alt="Planify Logo" style={{ height: 40 }} />
      </NavLink>

      {/* MIDDLE: SEARCH */}
      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            position: "relative",
            width: "100%",
            maxWidth: "420px",
          }}
        >
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            style={{
              position: "absolute",
              top: "50%",
              left: "14px",
              transform: "translateY(-50%)",
              color: "#64748b",
            }}
          />

          <input
            type="text"
            placeholder="Search..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 14px 10px 42px",
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
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "22px",
          fontSize: "20px",
        }}
      >
        {/* Language (Globe) + Dropdown container */}
        <div ref={languageContainerRef} style={{ position: "relative" }}>
          <FontAwesomeIcon
            icon={faGlobe}
            title="Language"
            style={{ color: "white", cursor: "pointer" }}
            onClick={() => setShowLanguage((prev) => !prev)}
          />
          <LanguageDropdown
            isOpen={showLanguage}
            onClose={() => setShowLanguage(false)}
            containerRef={languageContainerRef}
            currentLanguage={currentLanguage}
            onChangeLanguage={handleChangeLanguage}
          />
        </div>

        {/* Bell + Dropdown container */}
        <div ref={bellContainerRef} style={{ position: "relative" }}>
          <FontAwesomeIcon
            icon={faBell}
            title="Notifications"
            style={{ color: "white", cursor: "pointer" }}
            onClick={() => setShowNotifications((prev) => !prev)}
          />

          <NotificationDropdown
            isOpen={showNotifications}
            onClose={() => setShowNotifications(false)}
            containerRef={bellContainerRef}  // ← Pass ref to include bell in "inside" check
          />
        </div>

        <NavLink
          to="/myprofile"
          style={{
            color: "white",
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
          }}
        >
          <FontAwesomeIcon icon={faUser} title="My Profile" />
        </NavLink>
      </div>
    </header>
  );
}
import { NavLink } from "react-router-dom";
import { useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faBell,
  faUser,
  faGlobe,
} from "@fortawesome/free-solid-svg-icons";

import Logo from "../../assets/Logo.svg";

import UserMenuPopup from "./UserDropdown";
import NotificationDropdown from "./NotificationDropdown";
import LanguageDropdown from "./LanguageDropdown";

import "./Header.css";

export default function Header() {
  const [searchValue, setSearchValue] = useState("");

  const [openPopup, setOpenPopup] = useState(null);
  // "user" | "notif" | "lang" | null

  const userRef = useRef(null);
  const notifRef = useRef(null);
  const langRef = useRef(null);

  const toggle = (name) =>
    setOpenPopup((prev) => (prev === name ? null : name));

  return (
    <header className="app-header">
      {/* Logo */}
      <NavLink to="/home" className="app-header-logo">
        <img src={Logo} alt="Planify Logo" />
      </NavLink>

      {/* Search */}
      <div className="app-header-search">
        <FontAwesomeIcon icon={faMagnifyingGlass} className="icon" />
        <input
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="Search plans, users..."
        />
      </div>

      {/* Actions */}
      <div className="app-header-actions">
        {/* Language */}
        <div ref={langRef} className="popup-trigger">
          <div className="trigger-icon" onClick={() => toggle("lang")}>
            <FontAwesomeIcon icon={faGlobe} />
          </div>
          <LanguageDropdown
            isOpen={openPopup === "lang"}
            onClose={() => setOpenPopup(null)}
            containerRef={langRef}
            currentLanguage="en"
            onChangeLanguage={() => {}}
          />
        </div>

        {/* Notifications */}
        <div ref={notifRef} className="popup-trigger">
          <div className="trigger-icon" onClick={() => toggle("notif")}>
            <FontAwesomeIcon icon={faBell} />
          </div>
          <NotificationDropdown
            isOpen={openPopup === "notif"}
            onClose={() => setOpenPopup(null)}
            containerRef={notifRef}
          />
        </div>

        {/* User */}
        <div ref={userRef} className="popup-trigger">
          <div className="trigger-icon" onClick={() => toggle("user")}>
            <FontAwesomeIcon icon={faUser} />
          </div>
          <UserMenuPopup
            isOpen={openPopup === "user"}
            onClose={() => setOpenPopup(null)}
            containerRef={userRef}
            userName="Ngọc"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      </div>
    </header>
  );
}
import { NavLink } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faUser,
  faGlobe,
} from "@fortawesome/free-solid-svg-icons";

import Logo from "../../assets/Logo.svg";

import UserMenuPopup from "./UserDropdown";
import NotificationDropdown from "./NotificationDropdown";
import LanguageDropdown from "./LanguageDropdown";
import { authApi } from "../../api/auth";

import "./Header.css";

export default function Header() {
  const [openPopup, setOpenPopup] = useState(null);
  // "user" | "notif" | "lang" | null
  const [userName, setUserName] = useState("");

  const userRef = useRef(null);
  const notifRef = useRef(null);
  const langRef = useRef(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await authApi.me();
        const userData = response?.data?.result;
        if (userData?.username) {
          setUserName(userData.username);
        }
      } catch (error) {
        console.error("Failed to fetch current user:", error);
      }
    };

    fetchCurrentUser();
  }, []);

  const toggle = (name) =>
    setOpenPopup((prev) => (prev === name ? null : name));

  return (
    <header className="app-header">
      {/* Logo */}
      <NavLink to="/home" className="app-header-logo">
        <img src={Logo} alt="Planify Logo" />
      </NavLink>

      {/* Actions */}
      <div className="app-header-actions">
        {/* Language */}
        <div ref={langRef} className="popup-trigger">
          <FontAwesomeIcon
            icon={faGlobe}
            onClick={() => toggle("lang")}
          />
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
          <FontAwesomeIcon
            icon={faBell}
            onClick={() => toggle("notif")}
          />
          <NotificationDropdown
            isOpen={openPopup === "notif"}
            onClose={() => setOpenPopup(null)}
            containerRef={notifRef}
          />
        </div>

        {/* User */}
        <div ref={userRef} className="popup-trigger">
          <FontAwesomeIcon
            icon={faUser}
            onClick={() => toggle("user")}
          />
          <UserMenuPopup
            isOpen={openPopup === "user"}
            onClose={() => setOpenPopup(null)}
            containerRef={userRef}
            userName={userName}
          />
        </div>
      </div>
    </header>
  );
}
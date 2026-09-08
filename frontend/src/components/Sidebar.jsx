import {
  LayoutDashboard,
  Tv,
  Orbit,
  Moon,
  Sun,
} from "lucide-react";

import TwitchLogin from "./TwitchLogin";

function Sidebar({
  darkMode,
  setDarkMode,
  setCurrentPage,
}) {
  return (
    <aside className="sidebar">

      {/* LOGO */}
      <h2 className="logo">
        TwitchLedger
      </h2>

      {/* THEME TOGGLE */}
      <button
        className="theme-toggle"
        onClick={() =>
          setDarkMode(!darkMode)
        }
      >
        {darkMode ? (
          <>
            <Sun size={18} />
            <span>Light Mode</span>
          </>
        ) : (
          <>
            <Moon size={18} />
            <span>Dark Mode</span>
          </>
        )}
      </button>

      {/* SIDEBAR MENU */}
      <div className="sidebar-menu">

        {/* DASHBOARD */}
        <li
          onClick={() =>
            setCurrentPage("dashboard")
          }
        >
          <LayoutDashboard size={18} />
          <span>Dashboard</span>
        </li>

        {/* SUPPORT GALAXY */}
        <li
          onClick={() =>
            setCurrentPage("galaxy")
          }
        >
          <Orbit size={18} />
          <span>Support Galaxy</span>
        </li>

        {/* CHANNELS */}
        <li
          onClick={() =>
            setCurrentPage("channels")
          }
        >
          <Tv size={18} />
          <span>Channels</span>
        </li>

      </div>

      {/* LOGOUT / LOGIN */}
      {localStorage.getItem(
        "twitchLoggedIn"
      ) === "true" ? (
        <button
          className="logout-btn"
          onClick={() => {
            localStorage.removeItem(
              "twitchLoggedIn"
            );

            window.location.reload();
          }}
        >
          Logout
        </button>
      ) : (
        <TwitchLogin />
      )}

    </aside>
  );
}

export default Sidebar;
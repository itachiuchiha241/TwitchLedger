import {
  LayoutDashboard,
  Tv,
  Moon,
  Sun,
} from "lucide-react";

import TwitchLogin from "./TwitchLogin";

function Sidebar({ darkMode, setDarkMode, setCurrentPage }) {

  return (
    <aside className="sidebar">
      <h2 className="logo">TwitchLedger</h2>
      <button
        className="theme-toggle"
        onClick={() => setDarkMode(!darkMode)}
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
      <div className="sidebar-menu">

        <li
          onClick={() =>
            setCurrentPage("dashboard")
          }
        >
          <LayoutDashboard size={18} />
          <span>Dashboard</span>
        </li>

        <li
          onClick={() =>
            setCurrentPage("channels")
          }
        >
          <Tv size={18} />
          <span>Channels</span>
        </li>

      </div>



      {
        localStorage.getItem(
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
        )
      }


    </aside>
  );
}

export default Sidebar;
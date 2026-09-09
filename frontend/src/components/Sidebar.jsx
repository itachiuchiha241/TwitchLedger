import {
  LayoutDashboard,
  Tv,
  Orbit,
  Moon,
  Sun,
  LogOut,
} from "lucide-react";

function Sidebar({
  darkMode,
  setDarkMode,
  setCurrentPage,
  currentPage,
}) {
  return (
    <header className="top-navbar">

      {/* BRAND */}
      <div className="navbar-brand">
        <div className="brand-mark">
          TL
        </div>

        <span className="brand-name">
          TwitchLedger
        </span>
      </div>

      {/* NAVIGATION */}
      <nav className="navbar-navigation">

        <button
          className={`nav-item ${
            currentPage === "dashboard"
              ? "active"
              : ""
          }`}
          onClick={() =>
            setCurrentPage("dashboard")
          }
        >
          <LayoutDashboard size={18} />
          <span>Dashboard</span>
        </button>

        <button
          className={`nav-item ${
            currentPage === "galaxy"
              ? "active"
              : ""
          }`}
          onClick={() =>
            setCurrentPage("galaxy")
          }
        >
          <Orbit size={18} />
          <span>Support Galaxy</span>
        </button>

        <button
          className={`nav-item ${
            currentPage === "channels"
              ? "active"
              : ""
          }`}
          onClick={() =>
            setCurrentPage("channels")
          }
        >
          <Tv size={18} />
          <span>Channels</span>
        </button>

      </nav>

      {/* RIGHT SIDE */}
      <div className="navbar-actions">

        {/* THEME */}
        <button
          className="navbar-icon-button"
          onClick={() =>
            setDarkMode(!darkMode)
          }
          title={
            darkMode
              ? "Switch to light mode"
              : "Switch to dark mode"
          }
        >
          {darkMode ? (
            <Sun size={19} />
          ) : (
            <Moon size={19} />
          )}
        </button>

        {/* LOGOUT */}
        <button
          className="navbar-logout"
          onClick={() => {
            localStorage.removeItem(
              "twitchLoggedIn"
            );

            localStorage.removeItem(
              "twitchToken"
            );

            window.location.reload();
          }}
        >
          <LogOut size={17} />
          <span>Logout</span>
        </button>

      </div>

    </header>
  );
}

export default Sidebar;
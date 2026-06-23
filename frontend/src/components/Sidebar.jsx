import {
  LayoutDashboard,
  Tv,
  Moon,
  Sun,
} from "lucide-react";

function Sidebar({ darkMode, setDarkMode }) {
  return (
    <aside className="sidebar">
      <h2 className="logo">TwitchLedger</h2>

      <div className="sidebar-menu">
        <li>
          <LayoutDashboard size={18} />
          <span>Dashboard</span>
        </li>

        <li>
          <Tv size={18} />
          <span>Channels</span>
        </li>
      </div>

      <button
        className="theme-toggle"
        onClick={() => setDarkMode(!darkMode)}
      >
        {darkMode ? (
          <Sun size={20} />
        ) : (
          <Moon size={20} />
        )}
      </button>
    </aside>
  );
}

export default Sidebar;
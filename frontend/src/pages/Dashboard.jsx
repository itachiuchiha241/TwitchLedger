import { useState, useEffect } from "react";

import Sidebar from "../components/Sidebar";
import ProfileCard from "../components/ProfileCard";
import StatsCard from "../components/StatsCard";
import SupportedChannels from "../components/SupportedChannels";
import { channels } from "../services/data";

function Dashboard() {
  const [searchTerm, setSearchTerm] =
    useState("");

  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme =
      localStorage.getItem("theme");

    if (savedTheme === "light") {
      return false;
    }

    return true;
  });

  useEffect(() => {
    localStorage.setItem(
      "theme",
      darkMode ? "dark" : "light"
    );
  }, [darkMode]);

  const totalSubs = channels.reduce(
    (total, channel) =>
      total + channel.subs,
    0
  );

  const totalBits = channels.reduce(
    (total, channel) =>
      total + channel.bits,
    0
  );

  const totalChannels = channels.length;

  return (
    <div
      className={`dashboard-layout ${
        darkMode
          ? "dark-theme"
          : "light-theme"
      }`}
    >
      <Sidebar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      <main className="main-content">
        <input
          className="search-bar"
          type="text"
          placeholder="Search Twitch username..."
          value={searchTerm}
          onChange={(e) =>
            setSearchTerm(e.target.value)
          }
        />

        <h1>TwitchLedger Dashboard</h1>

        <ProfileCard />

        <div className="stats-grid">
          <StatsCard
            title="Gifted Subs"
            value={totalSubs.toLocaleString()}
          />

          <StatsCard
            title="Bits Donated"
            value={totalBits.toLocaleString()}
          />

          <StatsCard
            title="Channels Supported"
            value={totalChannels}
          />
        </div>

        <div className="content-grid">
          <SupportedChannels
            searchTerm={searchTerm}
          />
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
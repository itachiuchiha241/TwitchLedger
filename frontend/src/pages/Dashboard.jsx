
import { useState, useEffect } from "react";

import ChannelManager from "../components/ChannelManager";
import Sidebar from "../components/Sidebar";
import ProfileCard from "../components/ProfileCard";
import StatsCard from "../components/StatsCard";
import SupportedChannels from "../components/SupportedChannels";
import FollowHistory from "../components/FollowHistory";
import Channels from "../components/Channels";
import SupportGalaxy from "../components/SupportGalaxy";
import Footer from "../components/Footer";
import SupportHistory from "../components/SupportHistory";

import { getTwitchUser } from "../services/twitchApi";
import { fetchChannels } from "../services/channelApi";

function Dashboard({ onLogout }) {
  // SEARCH
  const [searchTerm, setSearchTerm] = useState("");
  const [userData, setUserData] = useState(null);

  // CURRENT PAGE
  const [currentPage, setCurrentPage] = useState("dashboard");

  // THEME
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme === "light" ? false : true;
  });

  // CHANNEL DATA
  const [channels, setChannels] = useState([]);
  const [channelsLoading, setChannelsLoading] = useState(true);

  // SAVE THEME
  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  // FETCH CHANNELS
  useEffect(() => {
    async function loadChannels() {
      try {
        setChannelsLoading(true);

        const data = await fetchChannels();
        setChannels(data);
      } catch (error) {
        console.error("Dashboard channel loading failed:", error);
      } finally {
        setChannelsLoading(false);
      }
    }

    loadChannels();
  }, []);

  // TWITCH USER SEARCH
  const handleSearch = async (e) => {
    if (e.key !== "Enter") return;

    const trimmedSearch = searchTerm.trim();

    if (!trimmedSearch) {
      setUserData(null);
      return;
    }

    try {
      const user = await getTwitchUser(trimmedSearch);
      setUserData(user);
    } catch (error) {
      console.error("Twitch user search failed:", error);
      setUserData(null);
    }
  };

  // DASHBOARD STATISTICS
  const totalSubs = channels.reduce(
    (total, channel) => total + (channel.subs || 0),
    0
  );

  const totalBits = channels.reduce(
    (total, channel) => total + (channel.bits || 0),
    0
  );

  const totalChannels = channels.length;

  const totalVerified = channels.filter(
    (channel) => channel.verified
  ).length;

  // RENDER
  return (
    <div
      className={`dashboard-layout ${darkMode ? "dark-theme" : "light-theme"
        }`}
    >
      {/* SIDEBAR */}
      <Sidebar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
        onLogout={onLogout}
      />

      {/* MAIN CONTENT */}
      <main className="main-content">
        {currentPage === "galaxy" ? (
          <div className="galaxy-fullscreen">
            <SupportGalaxy />
          </div>
        ) : currentPage === "channels" ? (
          <Channels />
        ) : currentPage === "manage" ? (
          <ChannelManager />
        ) : currentPage === "support" ? (
          <SupportHistory />
        ) : (
          <>
            {/* DASHBOARD HEADER */}
            <section className="dashboard-header">
              <div className="dashboard-heading">
                <span className="page-eyebrow">OVERVIEW</span>

                <h1>TwitchLedger Dashboard</h1>

                <p>
                  Track your Twitch support and discover your creator universe.
                </p>
              </div>

              {/* SEARCH */}
              <div className="search-wrapper">
                <span className="search-icon" aria-hidden="true">
                  ⌕
                </span>

                <input
                  id="twitch-search"
                  name="twitch-search"
                  className="search-bar"
                  type="text"
                  placeholder="Search Twitch username..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={handleSearch}
                />

                <span className="search-hint">Enter</span>
              </div>
            </section>

            {/* SEARCH RESULT */}
            {userData && (
              <div className="card profile-card">
                <a
                  href={`https://twitch.tv/${userData.login}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src={userData.profile_image_url}
                    alt={userData.display_name}
                    className="avatar"
                  />
                </a>

                <div>
                  <a
                    href={`https://twitch.tv/${userData.login}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="profile-link"
                  >
                    <h2>{userData.display_name}</h2>
                  </a>

                  <p>{userData.description || "Twitch creator"}</p>

                  <a
                    href={`https://twitch.tv/${userData.login}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="profile-link"
                  >
                    Open Twitch Channel
                  </a>
                </div>
              </div>
            )}

            {/* YOUR PROFILE */}
            <ProfileCard />

            {/* STATISTICS */}
            <section className="stats-grid">
              <StatsCard
                title="Gifted Subs"
                value={channelsLoading ? "..." : totalSubs.toLocaleString()}
              />

              <StatsCard
                title="Bits Donated"
                value={channelsLoading ? "..." : totalBits.toLocaleString()}
              />

              <StatsCard
                title="Channels Supported"
                value={channelsLoading ? "..." : totalChannels}
              />

              <StatsCard
                title="Verified Creators"
                value={channelsLoading ? "..." : totalVerified}
              />
            </section>
            
            {/* SUPPORTED CHANNELS + FOLLOW HISTORY */}
            <section className="content-grid">
              <SupportedChannels searchTerm={searchTerm} />
            </section>

            <section className="content-grid">
              <FollowHistory />
            </section>
          </>
        )}

        {/* FOOTER */}
        <Footer />
      </main>
    </div>
  );
}

export default Dashboard;

import { useState, useEffect } from "react";
import { getTwitchUser } from "../services/twitchApi";
import Sidebar from "../components/Sidebar";
import ProfileCard from "../components/ProfileCard";
import StatsCard from "../components/StatsCard";
import SupportedChannels from "../components/SupportedChannels";
import { channels } from "../services/data";
import LoginPage from "../components/LoginPage";
import Channels from "../components/Channels";

function Dashboard() {
  const [searchTerm, setSearchTerm] =
    useState("");

  const [userData, setUserData] =
    useState(null);

  const [currentPage, setCurrentPage] =
    useState("dashboard");

  const [darkMode, setDarkMode] =
    useState(() => {
      const savedTheme =
        localStorage.getItem(
          "theme"
        );

      return savedTheme === "light"
        ? false
        : true;
    });

  useEffect(() => {
    const hash =
      window.location.hash;

    if (
      hash.includes("access_token")
    ) {
      const token =
        new URLSearchParams(
          hash.substring(1)
        ).get("access_token");

      localStorage.setItem(
        "twitchToken",
        token
      );

      localStorage.setItem(
        "twitchLoggedIn",
        "true"
      );

      window.history.replaceState(
        {},
        document.title,
        window.location.pathname
      );

      window.location.reload();
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "theme",
      darkMode ? "dark" : "light"
    );
  }, [darkMode]);

  const handleSearch = async (e) => {
    if (e.key === "Enter") {
      try {
        const user =
          await getTwitchUser(
            searchTerm
          );

        setUserData(user);
      } catch (error) {
        console.error(error);
        setUserData(null);
      }
    }
  };

  const isLoggedIn =
    localStorage.getItem(
      "twitchLoggedIn"
    ) === "true";

  if (!isLoggedIn) {
    return <LoginPage />;
  }

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

  const totalChannels =
    channels.length;

  return (
    <div
      className={`dashboard-layout ${darkMode
          ? "dark-theme"
          : "light-theme"
        }`}
    >
      <Sidebar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        setCurrentPage={
          setCurrentPage
        }
      />

      <main className="main-content">
        {currentPage ===
          "channels" ? (
          <Channels />
        ) : (
          <>
            <input
              id="twitch-search"
              name="twitch-search"
              className="search-bar"
              type="text"
              placeholder="Search Twitch username..."
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(e.target.value)
              }
              onKeyDown={handleSearch}
            />

            {userData && (
              <div className="card profile-card">
                <img
                  src={
                    userData.profile_image_url
                  }
                  alt={
                    userData.display_name
                  }
                  className="avatar"
                />

                <div>
                  <h2>
                    {
                      userData.display_name
                    }
                  </h2>

                  <p>
                    {
                      userData.description
                    }
                  </p>

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

            <h1>
              TwitchLedger Dashboard
            </h1>

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
                value={
                  totalChannels
                }
              />
            </div>

            <div className="content-grid">
              <SupportedChannels
                searchTerm={
                  searchTerm
                }
              />
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default Dashboard;
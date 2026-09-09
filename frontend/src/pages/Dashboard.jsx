import { useState, useEffect } from "react";

import { getTwitchUser } from "../services/twitchApi";

import Sidebar from "../components/Sidebar";
import ProfileCard from "../components/ProfileCard";
import StatsCard from "../components/StatsCard";
import SupportedChannels from "../components/SupportedChannels";
import Channels from "../components/Channels";
import SupportGalaxy from "../components/SupportGalaxy";
import LoginPage from "../components/LoginPage";
import Footer from "../components/Footer";

import { channels } from "../services/data";


function Dashboard() {

  /* =========================================================
     SEARCH
     ========================================================= */

  const [searchTerm, setSearchTerm] = useState("");


  /* =========================================================
     TWITCH USER SEARCH RESULT
     ========================================================= */

  const [userData, setUserData] = useState(null);


  /* =========================================================
     CURRENT PAGE
     ========================================================= */

  const [currentPage, setCurrentPage] =
    useState("dashboard");


  /* =========================================================
     THEME
     ========================================================= */

  const [darkMode, setDarkMode] = useState(() => {

    const savedTheme =
      localStorage.getItem("theme");

    return savedTheme === "light"
      ? false
      : true;

  });


  /* =========================================================
     TWITCH OAUTH CALLBACK
     ========================================================= */

  useEffect(() => {

    const hash =
      window.location.hash;

    if (hash.includes("access_token")) {

      const token =
        new URLSearchParams(
          hash.substring(1)
        ).get("access_token");


      if (token) {

        localStorage.setItem(
          "twitchToken",
          token
        );

        localStorage.setItem(
          "twitchLoggedIn",
          "true"
        );

      }


      window.history.replaceState(
        {},
        document.title,
        window.location.pathname
      );


      window.location.reload();

    }

  }, []);


  /* =========================================================
     SAVE THEME
     ========================================================= */

  useEffect(() => {

    localStorage.setItem(
      "theme",
      darkMode
        ? "dark"
        : "light"
    );

  }, [darkMode]);


  /* =========================================================
     TWITCH USER SEARCH
     ========================================================= */

  const handleSearch = async (e) => {

    if (e.key !== "Enter") {
      return;
    }


    const trimmedSearch =
      searchTerm.trim();


    if (!trimmedSearch) {
      setUserData(null);
      return;
    }


    try {

      const user =
        await getTwitchUser(
          trimmedSearch
        );


      setUserData(user);

    } catch (error) {

      console.error(
        "Twitch user search failed:",
        error
      );

      setUserData(null);

    }

  };


  /* =========================================================
     LOGIN CHECK
     ========================================================= */

  const isLoggedIn =
    localStorage.getItem(
      "twitchLoggedIn"
    ) === "true";


  if (!isLoggedIn) {
    return <LoginPage />;
  }


  /* =========================================================
     DASHBOARD STATISTICS
     ========================================================= */

  const totalSubs =
    channels.reduce(
      (total, channel) =>
        total + channel.subs,
      0
    );


  const totalBits =
    channels.reduce(
      (total, channel) =>
        total + channel.bits,
      0
    );


  const totalChannels =
    channels.length;


  const totalVerified =
    channels.filter(
      (channel) =>
        channel.verified
    ).length;


  /* =========================================================
     RENDER
     ========================================================= */

  return (

    <div
      className={`dashboard-layout ${
        darkMode
          ? "dark-theme"
          : "light-theme"
      }`}
    >

      {/* =====================================================
          TOP NAVIGATION
          ===================================================== */}

      <Sidebar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
      />


      {/* =====================================================
          MAIN CONTENT
          ===================================================== */}

      <main className="main-content">


        {/* ===================================================
            SUPPORT GALAXY
            =================================================== */}

        {currentPage === "galaxy" ? (

          <div className="galaxy-fullscreen">

            <SupportGalaxy />

          </div>


        ) : currentPage === "channels" ? (


          /* =================================================
             CHANNELS
             ================================================= */

          <Channels />


        ) : (


          /* =================================================
             DASHBOARD
             ================================================= */

          <>

            {/* ===============================================
                DASHBOARD HEADER
                =============================================== */}

            <section className="dashboard-header">

              <div className="dashboard-heading">

                <span className="page-eyebrow">
                  OVERVIEW
                </span>

                <h1>
                  TwitchLedger Dashboard
                </h1>

                <p>
                  Track your Twitch support and
                  discover your creator universe.
                </p>

              </div>


              {/* =============================================
                  SEARCH
                  ============================================= */}

              <div className="search-wrapper">

                <span
                  className="search-icon"
                  aria-hidden="true"
                >
                  ⌕
                </span>


                <input
                  id="twitch-search"
                  name="twitch-search"
                  className="search-bar"
                  type="text"
                  placeholder="Search Twitch username..."
                  value={searchTerm}
                  onChange={(e) =>
                    setSearchTerm(
                      e.target.value
                    )
                  }
                  onKeyDown={
                    handleSearch
                  }
                />


                <span className="search-hint">
                  Enter
                </span>

              </div>

            </section>


            {/* ===============================================
                SEARCH RESULT
                =============================================== */}

            {userData && (

              <div className="card profile-card">

                <a
                  href={`https://twitch.tv/${userData.login}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >

                  <img
                    src={
                      userData.profile_image_url
                    }
                    alt={
                      userData.display_name
                    }
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

                    <h2>
                      {
                        userData.display_name
                      }
                    </h2>

                  </a>


                  <p>
                    {
                      userData.description ||
                      "Twitch creator"
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


            {/* ===============================================
                YOUR PROFILE
                =============================================== */}

            <ProfileCard />


            {/* ===============================================
                STATISTICS
                =============================================== */}

            <section className="stats-grid">

              <StatsCard
                title="Gifted Subs"
                value={
                  totalSubs.toLocaleString()
                }
              />


              <StatsCard
                title="Bits Donated"
                value={
                  totalBits.toLocaleString()
                }
              />


              <StatsCard
                title="Channels Supported"
                value={
                  totalChannels
                }
              />


              <StatsCard
                title="Verified Creators"
                value={
                  totalVerified
                }
              />

            </section>


            {/* ===============================================
                SUPPORTED CHANNELS
                =============================================== */}

            <section className="content-grid">

              <SupportedChannels
                searchTerm={searchTerm}
              />

            </section>

          </>

        )}


        {/* ===================================================
            FOOTER
            =================================================== */}

        <Footer />

      </main>

    </div>

  );

}


export default Dashboard;
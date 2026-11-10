
import { useEffect, useState } from "react";
import { fetchChannels } from "../services/channelApi";

function Channels() {
  // CHANNEL DATA
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // FETCH CHANNELS
  useEffect(() => {
    let isMounted = true;

    async function loadChannels() {
      try {
        setLoading(true);
        setError("");

        const data = await fetchChannels();

        if (isMounted) {
          setChannels(data);
        }
      } catch (error) {
        console.error("Channels loading failed:", error);

        if (isMounted) {
          setError("Failed to load supported creators.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadChannels();

    return () => {
      isMounted = false;
    };
  }, []);

  // RENDER
  return (
    <>
      <h1 className="channels-title">Supported Creators</h1>

      {loading && (
        <p className="channels-loading">
          Loading supported creators...
        </p>
      )}

      {error && (
        <p className="channels-error">
          {error}
        </p>
      )}

      {!loading && !error && channels.length === 0 && (
        <p className="channels-empty">
          No supported creators found.
        </p>
      )}

      {!loading && !error && channels.length > 0 && (
        <div className="channels-grid">
          {channels.map((channel) => (
            <div
              key={channel.name}
              className="creator-card"
            >
              <img
                src={channel.avatar}
                alt={channel.name}
                className="creator-avatar"
              />

              {/* RIGHT SIDE CONTENT WRAPPER */}
              <div className="creator-content">

                {/* CREATOR NAME + VERIFIED BADGE */}
                <h2 className="creator-name">
                  {channel.name}

                  {channel.verified && (
                    <div className="verified-badge">
                      <svg
                        viewBox="0 0 16 16"
                        width="16"
                        height="16"
                        aria-label="Verified Partner"
                        className="verified-icon"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M12.5 3.5 8 2 3.5 3.5 2 8l1.5 4.5L8 14l4.5-1.5L14 8l-1.5-4.5L12.5 3.5ZM7 11l4.5-4.5L10 5 7 8 5.5 6.5 4 8l3 3Z"
                        />
                      </svg>
                    </div>
                  )}
                </h2>

                {/* CREATOR ROLE */}
                <span className="creator-role">
                  {channel.role}
                </span>

                {/* CREATOR DESCRIPTION */}
                <p className="creator-description">
                  {(channel.description || "").length > 140
                    ? channel.description.slice(0, 140) + "..."
                    : channel.description || ""}
                </p>

                {/* TWITCH BUTTON */}
                <a
                  href={channel.twitchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="creator-button"
                >
                  Open Twitch Channel
                </a>

                {/* FOOTER */}
                <div className="creator-footer">
                  💜 Supported Creator
                </div>

              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export default Channels;

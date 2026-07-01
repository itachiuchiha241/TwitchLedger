import { channels } from "../services/data";

function Channels() {
  return (
    <>
      <h1>Supported Creators</h1>

      <div className="channels-grid">
        {channels.map((channel) => (
          <div key={channel.name} className="creator-card">

            <img
              src={channel.avatar}
              alt={channel.name}
              className="creator-avatar"
            />

            {/* RIGHT SIDE CONTENT WRAPPER */}
            <div className="creator-content">

              <h2 className="creator-name">
                {channel.name}
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
                      d="M12.5 3.5 8 2 3.5 3.5 2 8l1.5 4.5L8 14l4.5-1.5L14 8l-1.5-4.5ZM7 11l4.5-4.5L10 5 7 8 5.5 6.5 4 8l3 3Z"
                    />
                  </svg>
                </div>

              </h2>

              <span className="creator-role">
                {channel.role}
              </span>

              <p className="creator-description">
                {channel.description.length > 140
                  ? channel.description.slice(0, 140) + "..."
                  : channel.description}
              </p>

              <a
                href={channel.twitchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="creator-button"
              >
                Open Twitch Channel
              </a>

              <div className="creator-footer">
                💜 Supported Creator
              </div>

            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default Channels;
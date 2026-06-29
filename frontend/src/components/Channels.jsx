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
                <span className="verified">✓</span>
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
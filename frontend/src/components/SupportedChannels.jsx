import { channels } from "../services/data";

function SupportedChannels() {
  return (
    <div className="card supported-channels">
      <h2>Supported Channels</h2>

      <ul className="channel-list">
        {channels.map((channel) => (
          <li key={channel.name} className="channel-item">
            <img
              src={channel.avatar}
              alt={channel.name}
              className="channel-avatar"
            />

            <div className="channel-info">
              <a
                href={channel.twitchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="channel-name"
              >
                {channel.name}
              </a>

              <p>{channel.subs.toLocaleString()} Subs Gifted</p>
              <p>{channel.bits.toLocaleString()} Bits Donated</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SupportedChannels;
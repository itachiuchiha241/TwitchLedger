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

            <div>
              <strong>
                <a
                  href={channel.twitchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {channel.name}
                </a>
              </strong>

              <br />

              {channel.subs.toLocaleString()} Subs Gifted

              <br />

              {channel.bits.toLocaleString()} Bits Donated
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SupportedChannels;
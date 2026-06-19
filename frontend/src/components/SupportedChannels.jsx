import { channels } from "../services/data";

function SupportedChannels() {
  return (
    <div className="card supported-channels">
      <h2>Supported Channels</h2>

      <ul className="channel-list">
        {channels.map((channel) => (
          <li key={channel.name}>
            <strong>{channel.name}</strong>
            <br />
            {channel.subs.toLocaleString()} Subs Gifted
            <br />
            {channel.bits.toLocaleString()} Bits Donated
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SupportedChannels;
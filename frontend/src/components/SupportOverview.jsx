import { channels } from "../services/data";

function SupportOverview() {
  const totalSubs = channels.reduce(
    (total, channel) => total + channel.subs,
    0
  );

  const totalBits = channels.reduce(
    (total, channel) => total + channel.bits,
    0
  );

  const totalChannels = channels.length;

  return (
    <div className="card support-overview">
      <h2>Support Overview</h2>

      <p>Total Gifted Subs: {totalSubs.toLocaleString()}</p>
      <p>Total Bits: {totalBits.toLocaleString()}</p>
      <p>Channels Supported: {totalChannels}</p>
    </div>
  );
}

export default SupportOverview;
import Sidebar from "../components/Sidebar";
import ProfileCard from "../components/ProfileCard";
import StatsCard from "../components/StatsCard";
import SupportedChannels from "../components/SupportedChannels";
import SupportOverview from "../components/SupportOverview";
import { channels } from "../services/data";

function Dashboard() {
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
    <div className="dashboard-layout">
      <Sidebar />

      <main className="main-content">
        <input
          className="search-bar"
          type="text"
          placeholder="Search Twitch username..."
        />

        <h1>TwitchLedger Dashboard</h1>

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
            value={totalChannels}
          />
        </div>

        <div className="content-grid">
          <SupportedChannels />
          <SupportOverview />
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
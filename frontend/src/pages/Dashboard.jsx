import Sidebar from "../components/Sidebar";
import ProfileCard from "../components/ProfileCard";
import StatsCard from "../components/StatsCard";
import SupportedChannels from "../components/SupportedChannels";
import SupportOverview from "../components/SupportOverview";

function Dashboard() {
  return (
    <div>
      <Sidebar />

      <h1>TwitchLedger Dashboard</h1>

      <ProfileCard />

      <StatsCard title="Gifted Subs" value="7000" />
      <StatsCard title="Bits Donated" value="125000" />
      <StatsCard title="Channels Supported" value="3" />

      <SupportedChannels />
      <SupportOverview />
    </div>
  );
}

export default Dashboard;
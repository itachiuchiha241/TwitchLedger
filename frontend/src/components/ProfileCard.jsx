import profilePic from "../assets/prem.png";

function ProfileCard() {
  return (
    <div className="card profile-card">
      <img
        src={profilePic}
        alt="prem241t"
        className="avatar"
      />

      <div>
        <h2>prem241t</h2>
        <p>Twitch Supporter</p>
      </div>
    </div>
  );
}

export default ProfileCard;
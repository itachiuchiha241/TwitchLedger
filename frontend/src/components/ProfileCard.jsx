import profilePic from "../assets/prem.png";

function ProfileCard() {
  return (
    <div className="card profile-card">
      <img
        src={profilePic}
        alt="Prem"
        className="avatar"
      />

      <div>
        <h2>Prem</h2>
        <p>Twitch Supporter</p>
      </div>
    </div>
  );
}

export default ProfileCard;
import profilePic from "../assets/prem.png";

function ProfileCard() {
  return (
    <div className="card profile-card">
      <a
        href="https://www.twitch.tv/prem241t"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img
          src={profilePic}
          alt="prem241t"
          className="avatar"
        />
      </a>

      <div>
        <a
          href="https://www.twitch.tv/prem241t"
          target="_blank"
          rel="noopener noreferrer"
          className="profile-link"
        >
          <h2>prem241t</h2>
        </a>

        <p>Twitch Supporter</p>
      </div>
    </div>
  );
}

export default ProfileCard;
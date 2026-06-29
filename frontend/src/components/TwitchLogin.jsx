function TwitchLogin() {
  const clientId =
    "a6evew4gzjz1knd9pl3dh7czsy2gid";

  const redirectUri =
    "http://localhost:5173/";

  const twitchAuthUrl =
    `https://id.twitch.tv/oauth2/authorize` +
    `?client_id=${clientId}` +
    `&redirect_uri=${encodeURIComponent(
      redirectUri
    )}` +
    `&response_type=token` +
    `&scope=user:read:email`;

  return (
    <button
      className="twitch-login-btn"
      onClick={() =>
        (window.location.href =
          twitchAuthUrl)
      }
    >
      Login with Twitch
    </button>
  );
}

export default TwitchLogin;
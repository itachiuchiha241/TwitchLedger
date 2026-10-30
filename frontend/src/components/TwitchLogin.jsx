
function TwitchLogin() {
  const clientId = "a6evew4gzjz1knd9pl3dh7czsy2gid";

  // Automatically detects whether you're using PC or phone
  const redirectUri = `${window.location.origin}/`;

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "token",
    scope: "user:read:email",
  });

  const twitchAuthUrl =
    `https://id.twitch.tv/oauth2/authorize?${params.toString()}`;

  return (
    <button
      className="twitch-login-btn"
      onClick={() => {
        window.location.href = twitchAuthUrl;
      }}
    >
      Login with Twitch
    </button>
  );
}

export default TwitchLogin;

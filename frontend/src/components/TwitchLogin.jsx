
function TwitchLogin() {
  const clientId = "YOUR_CLIENT_ID";

  const redirectUri = window.location.hostname === "localhost"
    ? "http://localhost:5173/"
    : "https://itachiuchiha241.github.io/TwitchLedger/";

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

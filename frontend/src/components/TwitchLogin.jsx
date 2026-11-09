
function TwitchLogin() {
  const handleLogin = () => {
    window.location.assign(
      "http://localhost:5000/api/auth/twitch"
    );
  };

  return (
    <button
      type="button"
      className="twitch-login-btn"
      onClick={handleLogin}
    >
      Login with Twitch
    </button>
  );
}

export default TwitchLogin;

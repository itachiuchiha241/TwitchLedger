const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function TwitchLogin() {
  const handleLogin = () => {
    window.location.assign(`${API_BASE_URL}/api/auth/twitch`);
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

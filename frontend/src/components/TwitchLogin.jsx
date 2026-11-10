
function TwitchLogin() {
  const handleLogin = () => {
    window.location.href = "http://localhost:5000/api/auth/twitch";
  };

  return (
    <button onClick={handleLogin} className="twitch-login-button">
      Login with Twitch
    </button>
  );
}

export default TwitchLogin;

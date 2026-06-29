import TwitchLogin from "./TwitchLogin";

function LoginPage() {
  return (
    <div className="login-page">
      <div className="login-card">
        <h1>TwitchLedger</h1>

        <p>
          Track your Twitch support
          history.
        </p>

        <TwitchLogin />
      </div>
    </div>
  );
}

export default LoginPage;
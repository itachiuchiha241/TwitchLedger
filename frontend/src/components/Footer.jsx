function Footer() {
  return (
    <footer className="footer">
      <p>
        © {new Date().getFullYear()} TwitchLedger
      </p>

      <p>
        Built with React • Node.js • Twitch API
      </p>

      <p className="footer-version">
        Version 1.0.0
      </p>
    </footer>
  );
}

export default Footer;
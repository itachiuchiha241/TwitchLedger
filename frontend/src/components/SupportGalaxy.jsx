import GalaxyScene from "../components/GalaxyScene";
import { useEffect, useState } from "react";

function CreatorDetailCard({ creator, onClose }) {
  return (
    <aside
      className="galaxy-selection-layer"
      aria-label={`${creator.name} details`}
    >
      <section className="galaxy-creator-card" role="dialog" aria-modal="true">
        <div className="galaxy-card-glow" />
        <button
          type="button"
          className="galaxy-card-close"
          onClick={onClose}
          aria-label="Return to galaxy"
        >
          ×
        </button>

        <div className="galaxy-card-avatar">
          <img src={creator.avatar} alt="" />
        </div>

        <div className="galaxy-card-info">
          <span className="galaxy-card-eyebrow">Creator selected</span>
          <div className="galaxy-card-name">
            {creator.name}
            {creator.verified && <span className="galaxy-verified">✓</span>}
          </div>
          <span className="galaxy-card-role">{creator.role}</span>
          <p className="galaxy-card-description">{creator.description}</p>

          <div className="galaxy-card-stats">
            <div><strong>{creator.subs.toLocaleString()}</strong><span>Subs</span></div>
            <div><strong>{creator.bits.toLocaleString()}</strong><span>Bits</span></div>
          </div>

          <a
            className="galaxy-twitch-button"
            href={creator.twitchUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            View on Twitch ↗
          </a>
        </div>
      </section>
    </aside>
  );
}

function GalaxyExplorerHud() {
  return (
    <div className="galaxy-explorer-hud" aria-hidden="true">
      <div className="galaxy-scene-label">
        <span className="galaxy-scene-signal" />
        <div>
          <strong>Creator universe</strong>
          <span>13 creator signals connected</span>
        </div>
      </div>
      <div className="galaxy-control-hint">
        <span>Drag to explore</span>
        <i />
        <span>Scroll to zoom</span>
        <i />
        <span>Select a creator</span>
      </div>
    </div>
  );
}

function SupportGalaxy() {
  const [selectedCreator, setSelectedCreator] = useState(null);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") setSelectedCreator(null);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="support-galaxy-page">
      <GalaxyScene
        selectedCreator={selectedCreator}
        setSelectedCreator={setSelectedCreator}
      />
      {!selectedCreator && <GalaxyExplorerHud />}
      {selectedCreator && (
        <CreatorDetailCard
          creator={selectedCreator}
          onClose={() => setSelectedCreator(null)}
        />
      )}
    </div>
  );
}

export default SupportGalaxy;


import GalaxyScene from "../components/GalaxyScene";
import { fetchChannels } from "../services/channelApi";
import { fetchFollowedChannels } from "../services/followedChannelsApi";
import { useEffect, useState } from "react";

// Backend Twitch user endpoint
const TWITCH_API_URL = "http://localhost:5000/api/user";

// Get creator's real Twitch profile image
async function getCreatorAvatar(channel) {
  // Already have an avatar? Keep it.
  const existingAvatar =
    channel.avatar ||
    channel.profileImage ||
    channel.profile_image_url ||
    channel.profileImageUrl ||
    channel.thumbnail ||
    "";

  if (existingAvatar) {
    return existingAvatar;
  }

  const login =
    channel.broadcaster_login ||
    channel.login ||
    channel.name ||
    channel.display_name ||
    channel.displayName;

  if (!login) {
    return "";
  }

  try {
    const response = await fetch(
      `${TWITCH_API_URL}/${encodeURIComponent(login)}`
    );

    if (!response.ok) {
      console.error(`Avatar fetch failed for ${login}`);
      return "";
    }

    const result = await response.json();

    return (
      result.data?.[0]?.profile_image_url ||
      ""
    );
  } catch (error) {
    console.error(`Avatar error for ${login}:`, error);
    return "";
  }
}

// Creator details popup
function CreatorDetailCard({ creator, onClose }) {
  const hasSupport = creator.isSupported;

  return (
    <aside
      className="galaxy-selection-layer"
      aria-label={`${creator.name} details`}
    >
      <section
        className="galaxy-creator-card"
        role="dialog"
        aria-modal="true"
      >
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
          <img
            src={creator.avatar || "/default-avatar.png"}
            alt={creator.name}
          />
        </div>

        <div className="galaxy-card-info">
          <span className="galaxy-card-eyebrow">
            {hasSupport
              ? "Supported creator"
              : "Followed creator"}
          </span>

          <div className="galaxy-card-name">
            {creator.name}

            {creator.verified && (
              <span className="galaxy-verified">✓</span>
            )}
          </div>

          <span className="galaxy-card-role">
            {creator.role}
          </span>

          <p className="galaxy-card-description">
            {creator.description}
          </p>

          {hasSupport && (
            <div className="galaxy-card-stats">
              <div>
                <strong>
                  {(creator.subs || 0).toLocaleString()}
                </strong>
                <span>Subs</span>
              </div>

              <div>
                <strong>
                  {(creator.bits || 0).toLocaleString()}
                </strong>
                <span>Bits</span>
              </div>
            </div>
          )}

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

// Galaxy HUD
function GalaxyExplorerHud({ total }) {
  return (
    <div
      className="galaxy-explorer-hud"
      aria-hidden="true"
    >
      <div className="galaxy-scene-label">
        <span className="galaxy-scene-signal" />

        <div>
          <strong>Creator universe</strong>
          <span>
            {total} creator signals connected
          </span>
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

// Support Galaxy
function SupportGalaxy() {
  const [selectedCreator, setSelectedCreator] = useState(null);
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load supported and followed Twitch creators
  useEffect(() => {
    async function loadGalaxy() {
      try {
        setLoading(true);
        setError("");

        const [supportedResult, followedResult] =
          await Promise.all([
            fetchChannels(),
            fetchFollowedChannels(),
          ]);

        const supportedChannels = Array.isArray(
          supportedResult
        )
          ? supportedResult
          : supportedResult.channels ||
          supportedResult.data ||
          [];

        const followedChannels = Array.isArray(
          followedResult
        )
          ? followedResult
          : followedResult.data || [];

        // Supported creators take priority
        const merged = new Map();

        // Supported creators
        supportedChannels.forEach((channel) => {
          const key = String(
            channel.twitchId ||
            channel.broadcasterId ||
            channel.id ||
            channel.login ||
            channel.name
          ).toLowerCase();

          const login =
            channel.login ||
            channel.broadcaster_login ||
            channel.name;

          merged.set(key, {
            ...channel,

            id: channel.id || channel.twitchId,

            isSupported: true,

            avatar:
              channel.avatar ||
              channel.profileImage ||
              channel.profile_image_url ||
              channel.profileImageUrl ||
              channel.thumbnail ||
              "",

            name:
              channel.name ||
              channel.display_name ||
              channel.displayName ||
              channel.login,

            login,

            role: channel.role || "Supported creator",

            description:
              channel.description ||
              "A creator you support on Twitch.",

            twitchUrl:
              channel.twitchUrl ||
              `https://www.twitch.tv/${login}`,
          });
        });

        // Followed creators
        followedChannels.forEach((channel) => {
          const key = String(
            channel.broadcaster_id ||
            channel.twitchId ||
            channel.id ||
            channel.broadcaster_login ||
            channel.login
          ).toLowerCase();

          // Supported creators already exist
          if (merged.has(key)) return;

          const login =
            channel.broadcaster_login ||
            channel.login;

          merged.set(key, {
            ...channel,

            id:
              channel.broadcaster_id ||
              channel.id,

            twitchId:
              channel.broadcaster_id ||
              channel.twitchId,

            name:
              channel.broadcaster_name ||
              channel.display_name ||
              channel.displayName ||
              login,

            login,

            avatar:
              channel.avatar ||
              channel.profileImage ||
              channel.profile_image_url ||
              channel.profileImageUrl ||
              channel.thumbnail ||
              "",

            role: "Followed on Twitch",

            description:
              "A Twitch creator you follow.",

            twitchUrl:
              `https://www.twitch.tv/${login}`,

            subs: 0,
            bits: 0,

            isSupported: false,
          });
        });

        // Fetch missing Twitch avatars
        const creators = Array.from(
          merged.values()
        );

        const creatorsWithAvatars = await Promise.all(
          creators.map(async (creator) => {
            const avatar = await getCreatorAvatar(
              creator
            );

            return {
              ...creator,
              avatar,
            };
          })
        );

        setChannels(creatorsWithAvatars);
      } catch (err) {
        console.error("Galaxy loading error:", err);

        setError(
          err.message ||
          "Failed to load creator galaxy"
        );
      } finally {
        setLoading(false);
      }
    }

    loadGalaxy();
  }, []);

  // Escape key closes creator details
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setSelectedCreator(null);
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () =>
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="support-galaxy-page">
        <p>Connecting creator signals...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="support-galaxy-page">
        <p>{error}</p>
      </div>
    );
  }

  // Galaxy rendering
  return (
    <div className="support-galaxy-page">
      <GalaxyScene
        channels={channels}
        selectedCreator={selectedCreator}
        setSelectedCreator={setSelectedCreator}
      />

      {!selectedCreator && (
        <GalaxyExplorerHud total={channels.length} />
      )}

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

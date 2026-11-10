
import { useEffect, useState } from "react";

import { fetchChannels } from "../services/channelApi";

import {
  getGiftBadgeImage,
  getBitsBadgeImage,
} from "../services/badgeImages";

import {
  giftSubBadges,
  bitsBadges,
} from "../services/badgeLevels";

import {
  getCurrentBadge,
  getNextBadge,
  getProgress,
  getRemaining,
} from "../services/badgeUtils";

import { fetchChannelBadges } from "../services/badgeApi";

// Resolve MongoDB avatar paths to actual Vite asset URLs
const avatarImages = import.meta.glob("../assets/*", {
  eager: true,
  query: "?url",
  import: "default",
});

function getAvatarUrl(avatar) {
  if (!avatar) return "/default-avatar.png";

  const filename = avatar.split("/").pop();

  return avatarImages[`../assets/${filename}`] || avatar;
}

function SupportedChannels({ searchTerm = "" }) {
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [twitchBadges, setTwitchBadges] = useState({});

  // Fetch channels from MongoDB
  useEffect(() => {
    async function loadChannels() {
      try {
        setLoading(true);
        setError("");

        const data = await fetchChannels();

        setChannels(data);
      } catch (error) {
        console.error("Channel loading failed:", error);

        setError(
          "Failed to load channels. Please check the backend server."
        );
      } finally {
        setLoading(false);
      }
    }

    loadChannels();
  }, []);

  // Fetch Twitch badge images for channels
  useEffect(() => {
    let cancelled = false;

    async function loadTwitchBadges() {
      const results = {};

      for (const channel of channels) {
        // Twitch API requires broadcaster ID
        const broadcasterId = channel.twitchId;

        if (!broadcasterId) continue;

        try {
          results[broadcasterId] =
            await fetchChannelBadges(broadcasterId);
        } catch (error) {
          console.error(
            `Badge loading failed for ${channel.name}:`,
            error.message
          );
        }
      }

      if (!cancelled) {
        setTwitchBadges(results);
      }
    }

    if (channels.length > 0) {
      loadTwitchBadges();
    }

    return () => {
      cancelled = true;
    };
  }, [channels]);

  // Search channels
  const filteredChannels = channels.filter((channel) =>
    channel.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Select Twitch badge image, otherwise use local image
  function getSubBadgeUrl(channel, localBadge) {
    const badgeData = twitchBadges[channel.twitchId];

    const twitchBadge = badgeData?.subGift?.[0];

    return (
      twitchBadge?.image_url_2x ||
      twitchBadge?.image_url_1x ||
      getGiftBadgeImage(localBadge)
    );
  }

  function getBitsBadgeUrl(channel, localBadge) {
    const badgeData = twitchBadges[channel.twitchId];

    const twitchBadge = badgeData?.bits?.[0];

    return (
      twitchBadge?.image_url_2x ||
      twitchBadge?.image_url_1x ||
      getBitsBadgeImage(localBadge)
    );
  }

  return (
    <div className="card supported-channels">
      <h2>Supported Channels + Follow Channels</h2>

      {loading && <p>Loading channels...</p>}

      {error && <p className="error-message">{error}</p>}

      {!loading && !error && filteredChannels.length === 0 && (
        <p>No channels found.</p>
      )}

      {!loading && !error && (
        <ul className="channel-list">
          {filteredChannels.map((channel) => {
            const currentSubBadge = getCurrentBadge(
              channel.subs,
              giftSubBadges
            );

            const nextSubBadge = getNextBadge(
              channel.subs,
              giftSubBadges
            );

            const subProgress = getProgress(
              channel.subs,
              giftSubBadges
            );

            const subRemaining = getRemaining(
              channel.subs,
              giftSubBadges
            );

            const currentBitsBadge = getCurrentBadge(
              channel.bits,
              bitsBadges
            );

            const nextBitsBadge = getNextBadge(
              channel.bits,
              bitsBadges
            );

            const bitsProgress = getProgress(
              channel.bits,
              bitsBadges
            );

            const bitsRemaining = getRemaining(
              channel.bits,
              bitsBadges
            );

            return (
              <li key={channel.name} className="channel-item">
                <img
                  src={getAvatarUrl(channel.avatar)}
                  alt={channel.name}
                  className="channel-avatar"
                  onError={(event) => {
                    event.currentTarget.onerror = null;
                    event.currentTarget.src = "/default-avatar.png";
                  }}
                />

                <div className="channel-info">
                  <div className="channel-name-row">
                    <a
                      href={channel.twitchUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="channel-name"
                    >
                      {channel.name}
                    </a>

                    {channel.verified && (
                      <svg
                        className="verified-icon"
                        viewBox="0 0 16 16"
                        width="16"
                        height="16"
                        aria-label="Verified Partner"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M12.5 3.5 8 2 3.5 3.5 2 8l1.5 4.5L8 14l4.5-1.5L14 8l-1.5-4.5ZM7 11l4.5-4.5L10 5 7 8 5.5 6.5 4 8l3 3Z"
                        />
                      </svg>
                    )}
                  </div>

                  <p>{channel.subs.toLocaleString()} Subs Gifted</p>
                  <p>{channel.bits.toLocaleString()} Bits Donated</p>
                </div>

                <div className="channel-progress">
                  {/* SUB GIFT BADGES */}
                  <div className="badge-row">
                    <div className="badge-container">
                      {currentSubBadge ? (
                        <img
                          src={getSubBadgeUrl(channel, currentSubBadge)}
                          alt="Current Sub Gift Badge"
                          className="badge-icon"
                        />
                      ) : (
                        <span>—</span>
                      )}
                    </div>

                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{ width: `${subProgress}%` }}
                      />
                    </div>

                    <div className="badge-container">
                      {nextSubBadge ? (
                        <img
                          src={getSubBadgeUrl(channel, nextSubBadge)}
                          alt="Next Sub Gift Badge"
                          className="badge-icon"
                        />
                      ) : (
                        <span>✓</span>
                      )}
                    </div>
                  </div>

                  <p className="remaining-text">
                    {nextSubBadge
                      ? `${subRemaining.toLocaleString()} subs to next badge`
                      : "Maximum sub badge reached"}
                  </p>

                  {/* BITS BADGES */}
                  <div className="badge-row">
                    <div className="badge-container">
                      {currentBitsBadge ? (
                        <img
                          src={getBitsBadgeUrl(channel, currentBitsBadge)}
                          alt="Current Bits Badge"
                          className="badge-icon"
                        />
                      ) : (
                        <span>—</span>
                      )}
                    </div>

                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{ width: `${bitsProgress}%` }}
                      />
                    </div>

                    <div className="badge-container">
                      {nextBitsBadge ? (
                        <img
                          src={getBitsBadgeUrl(channel, nextBitsBadge)}
                          alt="Next Bits Badge"
                          className="badge-icon"
                        />
                      ) : (
                        <span>✓</span>
                      )}
                    </div>
                  </div>

                  <p className="remaining-text">
                    {nextBitsBadge
                      ? `${bitsRemaining.toLocaleString()} bits to next badge`
                      : "Maximum bits badge reached"}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default SupportedChannels;

import { channels } from "../services/data";

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

function SupportedChannels({ searchTerm }) {
  const filteredChannels = channels.filter((channel) =>
    channel.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (<div className="card supported-channels"> <h2>Supported Channels</h2>

    {filteredChannels.length === 0 && (
      <p>No channels found.</p>
    )}

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
          <li
            key={channel.name}
            className="channel-item"
          >
            <img
              src={channel.avatar}
              alt={channel.name}
              className="channel-avatar"
            />

            <div className="channel-info">
              <a
                href={channel.twitchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="channel-name"
              >
                {channel.name}
              </a>

              <p>
                {channel.subs.toLocaleString()} Subs Gifted
              </p>

              <p>
                {channel.bits.toLocaleString()} Bits Donated
              </p>
            </div>

            <div className="channel-progress">
              {/* SUB BADGES */}
              <div className="badge-row">
                <div className="badge-container">
                  {currentSubBadge ? (
                    <img
                      src={getGiftBadgeImage(
                        currentSubBadge
                      )}
                      alt="Current Sub Badge"
                      className="badge-icon"
                    />
                  ) : (
                    <span>—</span>
                  )}
                </div>

                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${subProgress}%`,
                    }}
                  ></div>
                </div>

                <div className="badge-container">
                  {nextSubBadge ? (
                    <img
                      src={getGiftBadgeImage(
                        nextSubBadge
                      )}
                      alt="Next Sub Badge"
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
                      src={getBitsBadgeImage(
                        currentBitsBadge
                      )}
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
                    style={{
                      width: `${bitsProgress}%`,
                    }}
                  ></div>
                </div>

                <div className="badge-container">
                  {nextBitsBadge ? (
                    <img
                      src={getBitsBadgeImage(
                        nextBitsBadge
                      )}
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
  </div>

  );
}

export default SupportedChannels;

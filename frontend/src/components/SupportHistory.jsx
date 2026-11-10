
import { useEffect, useState } from "react";

function FollowHistory() {
    const [channels, setChannels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const controller = new AbortController();

        async function loadFollowHistory() {
            try {
                const response = await fetch(
                    "http://localhost:5000/api/follows/history",
                    {
                        credentials: "include",
                        signal: controller.signal,
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.error || "Failed to load follow history"
                    );
                }

                setChannels(data.channels || []);
            } catch (err) {
                if (err.name !== "AbortError") {
                    setError(err.message || "Failed to load follow history");
                }
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        }

        loadFollowHistory();

        return () => controller.abort();
    }, []);

    function calculateFollowDuration(followedAt) {
        if (!followedAt) return "Unavailable";

        const start = new Date(followedAt);
        const now = new Date();

        if (Number.isNaN(start.getTime()) || start > now) {
            return "Unavailable";
        }

        let years = now.getFullYear() - start.getFullYear();
        let months = now.getMonth() - start.getMonth();

        if (now.getDate() < start.getDate()) {
            months--;
        }

        if (months < 0) {
            years--;
            months += 12;
        }

        if (years < 0) return "Unavailable";

        if (years === 0 && months === 0) {
            return "Less than 1 Month";
        }

        if (years === 0) {
            return `${months} Months`;
        }

        if (months === 0) {
            return `${years} Years`;
        }

        return `${years} Years ${months} Months`;
    }

    if (loading) {
        return (
            <div className="support-history-loading">
                Loading follow history...
            </div>
        );
    }

    return (
        <div className="support-history">
            <div className="support-history-header">
                <h1>Follow History</h1>
                <p>Your Twitch creators and follow duration.</p>
            </div>

            {error && (
                <div className="support-message error">
                    {error}
                </div>
            )}

            {!error && channels.length === 0 && (
                <p className="support-empty">
                    No followed channels found.
                </p>
            )}

            <div className="subscription-list">
                {channels.map((creator) => (
                    <article
                        className="subscription-card"
                        key={creator.channelId}
                    >
                        <img
                            src={
                                creator.avatar?.trim()
                                    ? creator.avatar
                                    : "/default-avatar.png"
                            }
                            alt={creator.creator}
                            className="subscription-avatar"
                            onError={(event) => {
                                event.currentTarget.onerror = null;
                                event.currentTarget.src =
                                    "/default-avatar.png";
                            }}
                        />

                        <div className="subscription-info">
                            <h2>{creator.creator}</h2>

                            <span className="subscription-label">
                                FOLLOWED FOR
                            </span>

                            <p className="subscription-duration">
                                {calculateFollowDuration(
                                    creator.followedAt
                                )}
                            </p>

                            {creator.followedAt && (
                                <p className="followed-date">
                                    Followed at:{" "}
                                    {new Date(
                                        creator.followedAt
                                    ).toLocaleDateString()}
                                </p>
                            )}
                        </div>
                    </article>
                ))}
            </div>
        </div>
    );
}

export default FollowHistory;

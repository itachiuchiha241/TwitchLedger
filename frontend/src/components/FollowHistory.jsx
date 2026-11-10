
import { useEffect, useState } from "react";

export default function FollowHistory() {
    const [channels, setChannels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadFollowHistory() {
            try {
                const response = await fetch(
                    "http://localhost:5000/api/follows/history",
                    {
                        credentials: "include",
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || "Failed to load follows");
                }

                setChannels(data.channels || []);
            } catch (err) {
                console.error("Follow history error:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        loadFollowHistory();
    }, []);

    return (
        <section className="follow-history-section">
            <h2 className="follow-history-heading">
                Followed Channels
            </h2>

            {loading && (
                <p className="follow-history-message">
                    Loading followed channels...
                </p>
            )}

            {error && (
                <p className="follow-history-message follow-history-error">
                    {error}
                </p>
            )}

            {!loading && !error && channels.length === 0 && (
                <p className="follow-history-message">
                    No followed channels found.
                </p>
            )}

            {!loading && !error && channels.length > 0 && (
                <div className="follow-history-grid">
                    {channels.map((channel) => (
                        <article
                            className="follow-history-card"
                            key={channel.channelId}
                        >
                            <img
                                src={channel.avatar}
                                alt={channel.creator}
                                className="follow-history-avatar"
                            />

                            <h3 className="follow-history-name">
                                {channel.creator}
                            </h3>

                            <a
                                href={`https://twitch.tv/${channel.login}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="follow-history-link"
                            >
                                Visit Twitch ↗
                            </a>

                            {channel.followedAt && (
                                <p className="follow-history-date">
                                    Followed:{" "}
                                    {new Date(
                                        channel.followedAt
                                    ).toLocaleDateString()}
                                </p>
                            )}
                        </article>
                    ))}
                </div>
            )}
        </section>
    );
}

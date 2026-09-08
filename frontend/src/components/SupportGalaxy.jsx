import { channels } from "../services/data";
import profilePic from "../assets/prem.png";
import galaxyBackground from "../assets/GalaxyBackground.jpeg";

function SupportGalaxy() {
    const totalSubs = channels.reduce(
        (total, channel) => total + channel.subs,
        0
    );

    const totalBits = channels.reduce(
        (total, channel) => total + channel.bits,
        0
    );

    return (
        <div
            className="support-galaxy-page"
            style={{
                backgroundImage: `url(${galaxyBackground})`,
            }}
        >

            {/* =========================
                HEADER
            ========================= */}

            <div className="galaxy-header">
                <h1>🌌 Support Galaxy</h1>

                <p>
                    Your personal universe of supported creators
                </p>
            </div>

            {/* =========================
                GALAXY
            ========================= */}

            <div className="galaxy-space">

                {/* BACKGROUND STARS */}

                <div className="galaxy-stars"></div>
                <div className="galaxy-stars galaxy-stars-two"></div>
                <div className="galaxy-stars galaxy-stars-three"></div>

                {/* ORBIT RINGS */}

                <div className="orbit orbit-one"></div>
                <div className="orbit orbit-two"></div>
                <div className="orbit orbit-three"></div>

                {/* CENTER */}

                <div className="galaxy-center">

                    <div className="galaxy-core">
                        <img
                            src={profilePic}
                            alt="Your profile"
                            className="galaxy-profile"
                        />
                    </div>

                    <span className="galaxy-you">
                        YOU
                    </span>

                </div>

                {/* CREATORS */}

                {channels.map((channel, index) => {

                    const supportScore =
                        channel.subs * 10 + channel.bits;

                    const size = Math.min(
                        90,
                        Math.max(
                            42,
                            42 + supportScore / 1800
                        )
                    );

                    const angle =
                        (360 / channels.length) * index;

                    const distance =
                        150 + (index % 3) * 75;

                    return (
                        <div
                            key={channel.name}
                            className="galaxy-creator"
                            style={{
                                "--angle": `${angle}deg`,
                                "--distance": `${distance}px`,
                                "--creator-size": `${size}px`,
                            }}
                        >

                            <div className="creator-orbit-position">

                                <div className="galaxy-creator-body">

                                    <img
                                        src={channel.avatar}
                                        alt={channel.name}
                                    />

                                    {channel.verified && (
                                        <span className="galaxy-verified">
                                            ✓
                                        </span>
                                    )}

                                </div>

                                <span className="galaxy-creator-name">
                                    {channel.name}
                                </span>

                            </div>

                        </div>
                    );
                })}

            </div>

            {/* =========================
                GALAXY STATS
            ========================= */}

            <div className="galaxy-info">

                <div className="galaxy-stat">
                    <strong>
                        {channels.length}
                    </strong>

                    <span>
                        Creators
                    </span>
                </div>

                <div className="galaxy-stat">
                    <strong>
                        {totalSubs.toLocaleString()}
                    </strong>

                    <span>
                        Gifted Subs
                    </span>
                </div>

                <div className="galaxy-stat">
                    <strong>
                        {totalBits.toLocaleString()}
                    </strong>

                    <span>
                        Bits Donated
                    </span>
                </div>

                <div className="galaxy-stat">
                    <strong>
                        {
                            channels.filter(
                                (channel) => channel.verified
                            ).length
                        }
                    </strong>

                    <span>
                        Verified
                    </span>
                </div>

            </div>

        </div>
    );
}

export default SupportGalaxy;
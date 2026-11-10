
import { useEffect, useState, useCallback } from "react";
import {
  Pencil,
  Trash2,
  RefreshCw,
  ExternalLink,
  Plus,
  X,
} from "lucide-react";

const API_URL = "http://localhost:5000/api/channels";
const TWITCH_API_URL = "http://localhost:5000/api/user";

const emptyForm = {
  name: "",
  twitchUrl: "",
  avatar: "",
  description: "",
  subs: 0,
  bits: 0,
  verified: false,
};

function ChannelManager() {
  const [channels, setChannels] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [fetchingTwitch, setFetchingTwitch] = useState(false);

  const [twitchUsername, setTwitchUsername] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Load channels from MongoDB
  const loadChannels = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(API_URL, {
        credentials: "include",
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch channels");
      }

      if (!Array.isArray(data)) {
        throw new Error("Invalid channel response");
      }

      setChannels(data);
    } catch (err) {
      setError(err.message || "Failed to load channels");
      setChannels([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load channels when component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      loadChannels();
    }, 0);

    return () => clearTimeout(timer);
  }, [loadChannels]);

  // Fetch Twitch creator profile
  async function handleFetchTwitch() {
    const username = twitchUsername.trim();

    if (!username) {
      setError("Enter a Twitch username first.");
      setMessage("");
      return;
    }

    try {
      setFetchingTwitch(true);
      setError("");
      setMessage("");

      const response = await fetch(
        `${TWITCH_API_URL}/${encodeURIComponent(username)}`,
        {
          credentials: "include",
        }
      );

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          result.error || "Failed to fetch Twitch profile"
        );
      }

      const user = result.data?.[0];

      if (!user) {
        throw new Error("Twitch user not found.");
      }

      // Automatically populate Twitch creator information
      setForm((previous) => ({
        ...previous,
        name: user.display_name || user.login || "",
        twitchUrl: user.login
          ? `https://www.twitch.tv/${user.login}`
          : "",
        avatar: user.profile_image_url || "",
        description: user.description || "",
      }));

      setMessage("Twitch profile fetched successfully!");
    } catch (err) {
      setError(err.message || "Failed to fetch Twitch profile");
    } finally {
      setFetchingTwitch(false);
    }
  }

  // Handle form inputs
  function handleChange(e) {
    const { name, value, type, checked } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  // Reset form
  function resetForm() {
    setForm({ ...emptyForm });
    setEditingId(null);
    setTwitchUsername("");
    setMessage("");
    setError("");
  }

  // Edit existing channel
  function handleEdit(channel) {
    setEditingId(channel._id);

    setForm({
      name: channel.name || "",
      twitchUrl: channel.twitchUrl || "",
      avatar: channel.avatar || "",
      description: channel.description || "",
      subs: channel.subs ?? 0,
      bits: channel.bits ?? 0,
      verified: channel.verified || false,
    });

    setTwitchUsername("");
    setMessage("");
    setError("");
  }

  // Add or update channel
  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");
      setMessage("");

      const payload = {
        name: form.name.trim(),
        twitchUrl: form.twitchUrl.trim(),
        avatar: form.avatar.trim(),
        description: form.description.trim(),
        subs: Number(form.subs),
        bits: Number(form.bits),
        verified: form.verified,
      };

      const response = await fetch(
        editingId ? `${API_URL}/${editingId}` : API_URL,
        {
          method: editingId ? "PUT" : "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result.error || "Failed to save channel");
      }

      const successMessage = editingId
        ? "Channel updated successfully!"
        : "Channel added successfully!";

      resetForm();
      setMessage(successMessage);

      await loadChannels();
    } catch (err) {
      setError(err.message || "Failed to save channel");
    } finally {
      setSaving(false);
    }
  }

  // Delete channel
  async function handleDelete(channel) {
    if (!window.confirm(`Delete ${channel.name}?`)) {
      return;
    }

    try {
      setError("");
      setMessage("");

      const response = await fetch(`${API_URL}/${channel._id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result.error || "Failed to delete channel");
      }

      if (editingId === channel._id) {
        resetForm();
      }

      setMessage("Channel deleted successfully!");
      await loadChannels();
    } catch (err) {
      setError(err.message || "Failed to delete channel");
    }
  }

  return (
    <section className="channel-manager">
      {/* PAGE HEADER */}
      <div className="channel-manager-header">
        <span className="page-eyebrow">MANAGEMENT</span>
        <h1>Manage Channels</h1>
        <p>Add, update, and manage your Twitch creators.</p>
      </div>

      {/* FORM */}
      <div className="channel-form-card">
        <div className="channel-form-header">
          <div>
            <span className="channel-form-eyebrow">
              {editingId ? "EDIT CREATOR" : "NEW CREATOR"}
            </span>

            <h2>
              {editingId ? "Update Channel" : "Add New Channel"}
            </h2>
          </div>

          {editingId && (
            <button
              type="button"
              className="channel-cancel-icon"
              onClick={resetForm}
              title="Cancel editing"
            >
              <X size={18} />
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="channel-form-grid">
            {/* TWITCH USERNAME FETCH */}
            <div className="channel-form-field channel-form-full">
              <label htmlFor="twitch-username">
                Twitch Username
              </label>

              <div style={{ display: "flex", gap: "10px" }}>
                <input
                  id="twitch-username"
                  value={twitchUsername}
                  onChange={(e) => setTwitchUsername(e.target.value)}
                  placeholder="Enter Twitch username"
                />

                <button
                  type="button"
                  className="channel-primary-button"
                  onClick={handleFetchTwitch}
                  disabled={fetchingTwitch}
                >
                  {fetchingTwitch ? "Fetching..." : "Fetch Profile"}
                </button>
              </div>
            </div>

            {/* CHANNEL NAME */}
            <label className="channel-form-field">
              Channel Name
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Creator name"
                required
              />
            </label>

            {/* TWITCH URL */}
            <label className="channel-form-field">
              Twitch URL
              <input
                type="url"
                name="twitchUrl"
                value={form.twitchUrl}
                onChange={handleChange}
                placeholder="https://www.twitch.tv/username"
                required
              />
            </label>

            {/* AVATAR */}
            <label className="channel-form-field channel-form-full">
              Avatar URL / Path
              <input
                name="avatar"
                value={form.avatar}
                onChange={handleChange}
                placeholder="/assets/channel.png or image URL"
                required
              />
            </label>

            {/* TWITCH BIO */}
            <label className="channel-form-field channel-form-full">
              Twitch Bio / About
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Creator's Twitch bio"
                rows={4}
              />
            </label>

            {/* GIFTED SUBS */}
            <label className="channel-form-field">
              Gifted Subs
              <input
                type="number"
                name="subs"
                min="0"
                value={form.subs}
                onChange={handleChange}
                required
              />
            </label>

            {/* BITS */}
            <label className="channel-form-field">
              Bits Donated
              <input
                type="number"
                name="bits"
                min="0"
                value={form.bits}
                onChange={handleChange}
                required
              />
            </label>
          </div>

          {/* VERIFIED */}
          <label className="channel-verified-checkbox">
            <input
              type="checkbox"
              name="verified"
              checked={form.verified}
              onChange={handleChange}
            />
            <span>Verified Creator</span>
          </label>

          {/* FORM ACTIONS */}
          <div className="channel-form-actions">
            <button
              type="submit"
              className="channel-primary-button"
              disabled={saving}
            >
              {saving ? (
                "Saving..."
              ) : editingId ? (
                <>
                  <Pencil size={16} />
                  Update Channel
                </>
              ) : (
                <>
                  <Plus size={16} />
                  Add Channel
                </>
              )}
            </button>

            {editingId && (
              <button
                type="button"
                className="channel-secondary-button"
                onClick={resetForm}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* STATUS MESSAGES */}
      {message && (
        <div className="channel-success">{message}</div>
      )}

      {error && (
        <div className="channel-error">{error}</div>
      )}

      {/* EXISTING CHANNELS */}
      <div className="channel-list-section">
        <div className="channel-list-header">
          <div>
            <h2>Existing Channels</h2>
            <p>{channels.length} creators in your database</p>
          </div>

          <button
            type="button"
            className="channel-secondary-button"
            onClick={loadChannels}
            disabled={loading}
          >
            <RefreshCw size={16} />
            {loading ? "Loading..." : "Refresh"}
          </button>
        </div>

        {loading ? (
          <div className="channel-empty-state">
            Loading channels...
          </div>
        ) : channels.length === 0 ? (
          <div className="channel-empty-state">
            No channels found.
          </div>
        ) : (
          <div className="channel-list">
            {channels.map((channel) => (
              <article
                className="channel-management-card"
                key={channel._id}
              >
                <div className="channel-management-info">
                  <img
                    className="channel-management-avatar"
                    src={channel.avatar}
                    alt={channel.name}
                    onError={(e) => {
                      e.currentTarget.style.visibility = "hidden";
                    }}
                  />

                  <div className="channel-management-details">
                    <h3>
                      {channel.name}
                      {channel.verified && (
                        <span className="channel-verified-badge">
                          ✓
                        </span>
                      )}
                    </h3>

                    <p>
                      Subs: {Number(channel.subs || 0).toLocaleString()}
                      {" "}·{" "}
                      Bits: {Number(channel.bits || 0).toLocaleString()}
                    </p>

                    <a
                      className="channel-management-link"
                      href={channel.twitchUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink size={13} />
                      Open Twitch Profile
                    </a>
                  </div>
                </div>

                <div className="channel-management-actions">
                  <button
                    type="button"
                    className="channel-edit-button"
                    onClick={() => handleEdit(channel)}
                  >
                    <Pencil size={15} />
                    Edit
                  </button>

                  <button
                    type="button"
                    className="channel-delete-button"
                    onClick={() => handleDelete(channel)}
                  >
                    <Trash2 size={15} />
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default ChannelManager;

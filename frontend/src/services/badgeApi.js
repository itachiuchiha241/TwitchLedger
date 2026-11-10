
const API_URL = "http://localhost:5000/api";

export async function fetchChannelBadges(broadcasterId) {
  const response = await fetch(
    `${API_URL}/badges/${broadcasterId}`,
    {
      credentials: "include",
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to fetch badges");
  }

  return data;
}

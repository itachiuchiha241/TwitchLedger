
const API_URL = "http://localhost:5000/api/channels";

// Fetch all channels
export async function fetchChannels() {
  const response = await fetch(API_URL, {
    credentials: "include",
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error || "Failed to fetch channels");
  }

  return response.json();
}

// Add a channel
export async function createChannel(channelData) {
  const response = await fetch(API_URL, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(channelData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to create channel");
  }

  return data;
}

// Update a channel
export async function updateChannel(id, channelData) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(channelData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to update channel");
  }

  return data;
}

// Delete a channel
export async function deleteChannel(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to delete channel");
  }

  return data;
}

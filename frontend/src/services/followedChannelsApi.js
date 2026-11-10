
export async function fetchFollowedChannels() {
  const response = await fetch(
    "http://localhost:5000/api/followed-channels",
    {
      method: "GET",
      credentials: "include",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch followed channels");
  }

  const result = await response.json();

  return result.data;
}

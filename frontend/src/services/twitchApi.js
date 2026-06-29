export async function getTwitchUser(
  username
) {
  const response = await fetch(
    `http://localhost:5000/api/user/${username}`
  );

  const data = await response.json();

  return data.data[0];
}
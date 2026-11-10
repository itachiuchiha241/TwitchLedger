
const API_URL = "http://localhost:5000/api/support/transactions";

async function handleResponse(response) {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || "Support API request failed");
  }

  return data;
}

// Fetch support history
export async function fetchSupportTransactions() {
  const response = await fetch(API_URL, {
    credentials: "include",
  });

  return handleResponse(response);
}

// Create support transaction
export async function createSupportTransaction(transactionData) {
  const response = await fetch(API_URL, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(transactionData),
  });

  return handleResponse(response);
}

// Delete support transaction
export async function deleteSupportTransaction(transactionId) {
  const response = await fetch(`${API_URL}/${transactionId}`, {
    method: "DELETE",
    credentials: "include",
  });

  return handleResponse(response);
}

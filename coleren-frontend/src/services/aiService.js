export const askAI = async (query) => {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_BASE}/ask`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    });

    if (!res.ok) {
      throw new Error("Failed to fetch AI response");
    }

    const data = await res.json();

    return data.response;
  } catch (err) {
    console.error("AI Service Error:", err);
    throw err;
  }
};

export const dashboard = async (token) => {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/dashboard`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch");
    }

    const data = await res.json();
    return data;
  } catch (err) {
    console.error("err", err);
  }
};

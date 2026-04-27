export const feedback = async (token, type) => {
  try {
    let url = `${import.meta.env.VITE_API_URL}/feedback`;

    if (type && type !== "ALL") {
      url += `?type=${type}`;
    }

    const res = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error("Failed to fetch");

    return await res.json();
  } catch (err) {
    console.error(err);
  }
};

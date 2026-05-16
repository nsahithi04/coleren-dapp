export const sendSurvey = async (content, token) => {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/survey`, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify({
        content,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message);
    }

    return data;
  } catch (err) {
    throw err;
  }
};

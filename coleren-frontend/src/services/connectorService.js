export const connectSalesforce = async (token) => {
  try {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/connectors/salesforce`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return res.json();
  } catch (err) {
    console.error(err);
  }
};

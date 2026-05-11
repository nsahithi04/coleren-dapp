export const getTeam = async (token) => {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/team`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error("Failed to fetch team");

    return await res.json();
  } catch (err) {
    console.error(err);
  }
};

export const updateMember = async (id, data, token) => {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/team/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error("Failed to update");

    return await res.json();
  } catch (err) {
    console.error(err);
  }
};

export const deleteMember = async (id, token) => {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/team/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error("Failed to delete");

    return await res.json();
  } catch (err) {
    console.error(err);
  }
};

export const inviteMembers = async (invites, token) => {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/team/invite`, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify({
        invites,
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

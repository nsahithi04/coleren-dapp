export const inviteTeam = async (data, token) => {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/team/invite`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error("Failed to invite");

    return await res.json();
  } catch (err) {
    console.error(err);
  }
};

export const acceptInvite = async (token) => {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/team/accept`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error("Failed to accept invite");

    return await res.json();
  } catch (err) {
    console.error(err);
  }
};

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

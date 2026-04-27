export const login = async (user, token) => {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(user),
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

export const signup = async (user, token) => {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/users/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(user),
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

export const verifyEmail = async (user) => {
  try {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/users/verifyEmail`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      },
    );

    if (!res.ok) {
      throw new Error("Failed to fetch");
    }

    const data = await res.json();
    return data;
  } catch (err) {
    console.error("err", err);
  }
};

export const getProfile = async (token) => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/users/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.json();
};

export const updateTask = async (key, value, token) => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/users/onboarding`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ key, value }),
  });

  return res.json();
};

export const updateProfile = async (token, payload) => {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/users/profile`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error("Failed to update");

    return await res.json();
  } catch (err) {
    console.error(err);
  }
};

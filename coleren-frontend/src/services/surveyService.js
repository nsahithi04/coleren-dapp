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

export const createSurvey = async (content, token) => {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/survey/create`, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify(content),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Failed to create survey");
    }

    return data;
  } catch (err) {
    throw err;
  }
};

export const getSurveyById = async (surveyId) => {
  try {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/survey/${surveyId}`,
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Failed to fetch survey");
    }

    return data;
  } catch (err) {
    throw err;
  }
};

export const submitSurvey = async (surveyId, payload) => {
  try {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/survey/submit/${surveyId}`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(payload),
      },
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Failed to submit survey");
    }

    return data;
  } catch (err) {
    throw err;
  }
};

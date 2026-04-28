export const getStates = async () => {
  try {
    const res = await fetch(
      "https://countriesnow.space/api/v0.1/countries/states",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ country: "United States" }),
      },
    );

    const data = await res.json();
    return data.data.states;
  } catch (err) {
    console.log(err);
  }
};

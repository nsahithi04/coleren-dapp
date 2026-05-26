export const salesforceAuth = async (req, res) => {
  try {
    const firebaseUid = req.user.uid;
    console.log("connected to saled force");
    res.json({
      firebaseUid,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      error: "Connection failed",
    });
  }
};

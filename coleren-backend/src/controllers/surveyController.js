import { sendTemplateEmail } from "../emails/sendMail.js";

export const sendSurvey = async (req, res) => {
  try {
    const { recipients, body, subject } = req.body.content;

    for (const recipient of recipients) {
      await sendTemplateEmail({
        to: recipient,

        type: "CUSTOM",

        data: {
          body,
          subject,
        },
      });
    }

    res.json({
      message: "Emails sent successfully",
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Failed to send emails",
    });
  }
};

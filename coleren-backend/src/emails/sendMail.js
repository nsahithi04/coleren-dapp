import { sendMail } from "../middleware/mail.js";

import existingUserInvite from "./template/existingUserInvite.js";
import newUserInvite from "./template/newUserInvite.js";

const EMAIL_TYPES = {
  EXISTING_USER_INVITE: {
    subject: "Team Invitation",

    template: existingUserInvite,
  },

  NEW_USER_INVITE: {
    subject: "Join Coleren",

    template: newUserInvite,
  },
};

export const sendTemplateEmail = async ({ type, to, data }) => {
  const emailConfig = EMAIL_TYPES[type];

  if (!emailConfig) {
    throw new Error("Invalid email type");
  }

  await sendMail({
    to,

    subject: emailConfig.subject,

    html: emailConfig.template(data),
  });
};

import { sendTemplateEmail } from "../emails/sendMail.js";
import crypto from "crypto";
import Survey from "../models/Survey.js";
import User from "../models/User.js";

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

export const createSurvey = async (req, res) => {
  try {
    const firebaseUid = req.user.uid;

    const currentUser = await User.findOne({
      firebaseUid,
    });

    if (!currentUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const {
      customerName,
      customerEmail,
      productName,
      salesRepName,
      industryType,
    } = req.body;

    if (!customerName || !customerEmail || !productName || !salesRepName) {
      return res.status(400).json({
        message: "Missing required fields",
      });
    }

    const surveyId = "SVY_" + crypto.randomBytes(6).toString("hex");

    const surveyLink = `${process.env.FRONTEND_URL}/survey/${surveyId}`;

    const survey = await Survey.create({
      userId: currentUser._id,
      surveyId,
      customerName,
      customerEmail,
      productName,
      salesRepName,
      industryType,
      status: "PENDING",
    });

    res.json({
      message: "Survey created successfully",
      surveyId,
      surveyLink,
      survey,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Failed to create survey",
    });
  }
};

export const getSurveyById = async (req, res) => {
  try {
    const { surveyId } = req.params;

    const survey = await Survey.findOne({
      surveyId,
    });

    if (!survey) {
      return res.status(404).json({
        message: "Survey not found",
      });
    }

    res.json(survey);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Failed to fetch survey",
    });
  }
};

export const submitSurvey = async (req, res) => {
  try {
    const { surveyId } = req.params;

    const { positives, negatives, additionalComments } = req.body;

    const survey = await Survey.findOne({
      surveyId,
    });

    if (!survey) {
      return res.status(404).json({
        message: "Survey not found",
      });
    }

    if (survey.status === "COMPLETED") {
      return res.status(400).json({
        message: "Survey has already been submitted",
      });
    }

    survey.positives = positives;
    survey.negatives = negatives;
    survey.additionalComments = additionalComments;
    survey.status = "COMPLETED";
    survey.submittedAt = new Date();

    await survey.save();

    res.json({
      message: "Survey submitted successfully",
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Failed to submit survey",
    });
  }
};

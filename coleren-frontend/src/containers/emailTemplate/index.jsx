import DashboardLayout from "../../layout/dashboardLayout";
import MultiTagInput from "../../components/common/MultiTagInput";
import InviteDrop from "@/components/common/inviteDropdown";
import { useState, useEffect } from "react";
import { sendSurvey } from "../../services/surveyService";
import { auth } from "../../../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useRef } from "react";
import { isValidEmail } from "@/utils/validation";
import { useLocation } from "react-router-dom";

const TYPES = ["Sales Rep survey", "product feedback summary"];

const TEMPLATE_CONTENT = {
  "Sales Rep survey": {
    subject: "Invite to join Coleren Sales Rep Survey",
    body: `<p>Hi,</p>
<p>You have been invited to participate in the <strong>Sales Representative Survey</strong>.</p>
<p>Your feedback will help us improve team performance, communication, and customer experience.</p>
<p>Please complete the survey using the link provided below.</p>
<p>Thank you,<br />Coleren Team</p>
`,
  },

  "product feedback summary": {
    subject: "Request for Product Feedback",

    body: `<p>Hi,</p>
<p>We would love to hear your thoughts about our product.</p>
<p>Your feedback helps us improve features, usability, and overall customer experience.</p>
<p>Please complete the feedback survey using the link below.</p>
<p>Thank you,<br />Coleren Team</p>`,
  },
};

export default function EmailTemplate() {
  const [data, setData] = useState({
    recipients: [],
    type: "Sales Rep survey",
    subject: TEMPLATE_CONTENT["Sales Rep survey"].subject,
    body: TEMPLATE_CONTENT["Sales Rep survey"].body,
  });

  const [successOpen, setSuccessOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [token, setToken] = useState("");
  const location = useLocation();

  const recipients = location.state?.recipients || [];
  const surveyLink = location.state?.surveyLink || "";

  const editorRef = useRef(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) return;

      try {
        const t = await firebaseUser.getIdToken();
        setToken(t);
      } catch (err) {
        console.error(err);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!surveyLink) return;

    setData((prev) => ({
      ...prev,
      recipients,
      body: `
      <p>Hi,</p>

      <p>You have been invited to participate in the <strong>Sales Representative Survey</strong>.</p>

      <p>Please complete the survey using the link below:</p>

      <p>
        <a href="${surveyLink}" target="_blank">
          Take Survey
        </a>
      </p>

      <p>${surveyLink}</p>

      <p>Thank you,<br />Coleren Team</p>
    `,
    }));
  }, [surveyLink]);

  const handleSubmit = async () => {
    try {
      setErrorMessage("");
      setSuccessOpen(false);

      const payload = {
        ...data,
        body: editorRef.current.innerHTML,
      };

      const response = await sendSurvey(payload, token);

      console.log("RESPONSE:", response);

      setSuccessOpen(true);
    } catch (err) {
      console.log("ERROR:", err);

      setErrorMessage(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to send survey emails",
      );
    }
  };

  const updateData = (key, value) => {
    setData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <DashboardLayout>
      <div className="bg-white rounded-2xl border border-gray-100 p-10 flex flex-col gap-8">
        <div>
          <h2 className="text-2xl font-semibold">Invite mail template</h2>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Recipients</label>

          <MultiTagInput
            value={data.recipients}
            onChange={(val) => {
              if (!val.every(isValidEmail)) {
                setErrorMessage("Please enter valid email addresses");
                return;
              }

              setErrorMessage("");
              updateData("recipients", val);
            }}
          />
        </div>

        {/* SUBJECT */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Subject Line</label>

          <input
            type="text"
            value={data.subject}
            onChange={(e) => updateData("subject", e.target.value)}
            className="border border-[#A1A1A1] h-[50px] rounded-md px-5 py-4 outline-none"
          />
        </div>

        {/* TEMPLATE */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Survey Template</label>

          <InviteDrop
            value={data.type}
            placeholder="Select an option"
            onChange={(e) => {
              const selectedType = e.target.value;

              setData((prev) => ({
                ...prev,
                type: selectedType,
                subject: TEMPLATE_CONTENT[selectedType].subject,
                body: TEMPLATE_CONTENT[selectedType].body,
              }));
            }}
            options={TYPES}
          />
        </div>

        {/* BODY */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Body</label>

          <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning={true}
            className="border border-[#A1A1A1] rounded-xl p-6 min-h-[300px] outline-none whitespace-pre-wrap"
            dangerouslySetInnerHTML={{
              __html: data.body,
            }}
            onInput={(e) => {
              data.body = e.currentTarget.innerHTML;
            }}
          />
        </div>

        {/* SUBMIT */}
        <button
          onClick={handleSubmit}
          className="w-fit bg-[#25C766] text-white py-3 px-5 rounded-lg text-md font-semibold"
        >
          Submit
        </button>

        {/* SUCCESS */}
        {successOpen && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-2xl shadow-xl text-center">
              <h2 className="text-2xl font-semibold text-[#062732] mb-2">
                Survey Sent
              </h2>

              <p className="text-gray-500 mb-6">Mail sent successfully.</p>

              <button
                onClick={() => setSuccessOpen(false)}
                className="bg-[#25C766] text-white px-6 py-3 rounded-lg"
              >
                Done
              </button>
            </div>
          </div>
        )}

        {/* ERROR */}
        {errorMessage && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-2xl shadow-xl text-center">
              <h2 className="text-2xl font-semibold text-red-500 mb-2">
                Error sending email
              </h2>

              <p className="text-gray-500 mb-6">{errorMessage}</p>

              <button
                onClick={() => setErrorMessage("")}
                className="bg-red-500 text-white px-6 py-3 rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

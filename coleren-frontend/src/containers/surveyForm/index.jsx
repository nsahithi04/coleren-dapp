import DashboardLayout from "../../layout/dashboardLayout";
import { useState, useEffect } from "react";
import { auth } from "../../../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { createSurvey } from "../../services/surveyService";
import { useNavigate } from "react-router-dom";

export default function SurveyForm() {
  const [successOpen, setSuccessOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [generatedLink, setGeneratedLink] = useState("");
  const [token, setToken] = useState("");
  const navigate = useNavigate();

  const [data, setData] = useState({
    customerName: "",
    customerEmail: "",
    productName: "",
    industryType: "",
    salesRepName: "",
  });

  const buildEmailBody = (surveyLink) => `<p>Hi ${data.customerName},</p>
<p>Thank you for your time. As a valued customer of <strong>${data.productName}</strong>, we'd love to hear your feedback on your recent experience with our sales team.</p>
<p>You have been invited to participate in the <strong>Sales Representative Survey</strong>, conducted by ${data.salesRepName}.</p>
<p>Please complete the survey using the link below:</p>
<p><a href="${surveyLink}" target="_blank">Take Survey</a></p>
<p>${surveyLink}</p>
<p>Thank you,<br />Coleren Team</p>`;

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

  const updateData = (key, value) => {
    setData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      setErrorMessage("");
      setSuccessOpen(false);

      if (
        !data.customerName ||
        !data.customerEmail ||
        !data.productName ||
        !data.salesRepName
      ) {
        setErrorMessage("Please fill all customer details");
        return;
      }

      const payload = {
        ...data,
      };

      console.log("PAYLOAD:", payload);

      const response = await createSurvey(payload, token);

      console.log("RESPONSE:", response);

      setGeneratedLink(response.surveyLink);
      setSuccessOpen(true);
    } catch (err) {
      console.log(err);
      setErrorMessage(err?.message || "Failed to create survey");
    }
  };

  const handleSendEmail = () => {
    navigate("/surveys/email", {
      state: {
        recipients: [data.customerEmail],
        surveyLink: generatedLink,
        body: buildEmailBody(generatedLink),
        subject: `Survey Invitation – ${data.productName}`,
      },
    });
  };

  return (
    <DashboardLayout>
      <div className="bg-white rounded-2xl border border-gray-100 p-10 flex flex-col gap-10">
        <div>
          <h2 className="text-2xl font-semibold">Create Survey</h2>

          <p className="text-gray-500 mt-1">Generate a customer survey link</p>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Customer Name</label>

            <input
              type="text"
              value={data.customerName}
              onChange={(e) => updateData("customerName", e.target.value)}
              placeholder="Enter customer name"
              className="border border-[#A1A1A1] h-[50px] rounded-md px-5 outline-none"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Customer Email</label>

            <input
              type="email"
              value={data.customerEmail}
              onChange={(e) => updateData("customerEmail", e.target.value)}
              placeholder="Enter customer email"
              className="border border-[#A1A1A1] h-[50px] rounded-md px-5 outline-none"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Product Name</label>

            <input
              type="text"
              value={data.productName}
              onChange={(e) => updateData("productName", e.target.value)}
              placeholder="Enter product name"
              className="border border-[#A1A1A1] h-[50px] rounded-md px-5 outline-none"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Industry Type</label>

            <input
              type="text"
              value={data.industryType}
              onChange={(e) => updateData("industryType", e.target.value)}
              placeholder="Enter industry type"
              className="border border-[#A1A1A1] h-[50px] rounded-md px-5 outline-none"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Sales Rep Name</label>

            <input
              type="text"
              value={data.salesRepName}
              onChange={(e) => updateData("salesRepName", e.target.value)}
              placeholder="Enter sales rep name"
              className="border border-[#A1A1A1] h-[50px] rounded-md px-5 outline-none"
            />
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <h3 className="text-lg font-semibold">Positive Feedback</h3>

            <p className="text-gray-500 text-sm">Add positive talking points</p>
          </div>

          <input
            type="text"
            disabled
            placeholder={`Positive Point 1`}
            className="border border-[#A1A1A1] h-[50px] rounded-md px-5 outline-none"
          />

          <button
            type="button"
            className="w-fit text-sm font-medium text-[#25C766]"
          >
            + Add Positive Point
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <h3 className="text-lg font-semibold">Negative Feedback</h3>

            <p className="text-gray-500 text-sm">Add negative talking points</p>
          </div>

          <input
            type="text"
            disabled
            placeholder={`Negative Point 1`}
            className="border border-[#A1A1A1] h-[50px] rounded-md px-5 outline-none"
          />

          <button
            type="button"
            className="w-fit text-sm font-medium text-red-500"
          >
            + Add Negative Point
          </button>
        </div>

        <div className="flex flex-col gap-3">
          <div>
            <h3 className="text-lg font-semibold">Additional Comments</h3>

            <p className="text-gray-500 text-sm">Optional notes or comments</p>
          </div>

          <textarea
            rows={3}
            disabled
            placeholder="Enter additional comments..."
            className="border border-[#A1A1A1] rounded-xl p-5 outline-none resize-none"
          />
        </div>

        <button
          onClick={handleSubmit}
          className="w-fit bg-[#25C766] text-white py-3 px-6 rounded-lg text-md font-semibold"
        >
          Generate Survey Link
        </button>

        {successOpen && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-2xl shadow-xl text-center w-[500px]">
              <h2 className="text-2xl font-semibold text-[#062732] mb-3">
                Survey Created
              </h2>

              <p className="text-gray-500 mb-6">
                Survey link generated successfully
              </p>

              <div className="bg-gray-100 rounded-lg p-4 text-sm break-all mb-6">
                {generatedLink}
              </div>

              <button
                onClick={() => {
                  navigator.clipboard.writeText(generatedLink);
                }}
                className="bg-[#25C766] text-white px-6 py-3 rounded-lg mr-3"
              >
                Copy Link
              </button>

              <button
                onClick={handleSendEmail}
                className="bg-[#25C766] text-white px-6 py-3 rounded-lg mr-3"
              >
                Send Email
              </button>

              <button
                onClick={() => setSuccessOpen(false)}
                className="bg-gray-200 px-6 py-3 rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {errorMessage && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-2xl shadow-xl text-center">
              <h2 className="text-2xl font-semibold text-red-500 mb-2">
                Error Creating Survey
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

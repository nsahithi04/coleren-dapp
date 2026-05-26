import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getSurveyById, submitSurvey } from "../../../services/surveyService";

export default function PublicSurveyForm() {
  const { surveyId } = useParams();
  const [successOpen, setSuccessOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [data, setData] = useState({
    customerName: "",
    customerEmail: "",
    productName: "",
    salesRepName: "",
    positives: [""],
    negatives: [""],
    additionalComments: "",
  });

  useEffect(() => {
    fetchSurvey();
  }, []);

  const fetchSurvey = async () => {
    try {
      const response = await getSurveyById(surveyId);

      setData((prev) => ({
        ...prev,

        customerName: response.customerName,
        customerEmail: response.customerEmail,
        productName: response.productName,
        salesRepName: response.salesRepName,
      }));
    } catch (err) {
      console.log(err);

      setErrorMessage(err.message || "Failed to load survey");
    } finally {
      setLoading(false);
    }
  };

  const updateData = (key, value) => {
    setData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      setErrorMessage("");

      const payload = {
        positives: data.positives.filter((item) => item.trim() !== ""),
        negatives: data.negatives.filter((item) => item.trim() !== ""),
        additionalComments: data.additionalComments,
      };

      const response = await submitSurvey(surveyId, payload);
      console.log("RESPONSE:", response);

      setSuccessOpen(true);
    } catch (err) {
      console.log(err);

      setErrorMessage(err.message || "Failed to submit survey");
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-10 flex flex-col gap-10">
      <div>
        <h2 className="text-2xl font-semibold">Customer Feedback Survey</h2>

        <p className="text-gray-500 mt-1">Please complete the feedback form</p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Customer Name</label>

          <input
            type="text"
            value={data.customerName}
            disabled
            className="border border-[#A1A1A1] h-[50px] rounded-md px-5 bg-gray-100 outline-none"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Customer Email</label>

          <input
            type="email"
            value={data.customerEmail}
            disabled
            className="border border-[#A1A1A1] h-[50px] rounded-md px-5 bg-gray-100 outline-none"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Product Name</label>

          <input
            type="text"
            value={data.productName}
            disabled
            className="border border-[#A1A1A1] h-[50px] rounded-md px-5 bg-gray-100 outline-none"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Sales Rep Name</label>

          <input
            type="text"
            value={data.salesRepName}
            disabled
            className="border border-[#A1A1A1] h-[50px] rounded-md px-5 bg-gray-100 outline-none"
          />
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div>
          <h3 className="text-lg font-semibold">Positive Feedback</h3>

          <p className="text-gray-500 text-sm">Share positive feedback</p>
        </div>

        {data.positives.map((item, index) => (
          <input
            key={index}
            type="text"
            value={item}
            placeholder={`Positive Point ${index + 1}`}
            onChange={(e) => {
              const updated = [...data.positives];

              updated[index] = e.target.value;

              updateData("positives", updated);
            }}
            className="border border-[#A1A1A1] h-[50px] rounded-md px-5 outline-none"
          />
        ))}

        <button
          type="button"
          onClick={() => updateData("positives", [...data.positives, ""])}
          className="w-fit text-sm font-medium text-[#25C766]"
        >
          + Add Positive Point
        </button>
      </div>

      <div className="flex flex-col gap-4">
        <div>
          <h3 className="text-lg font-semibold">Negative Feedback</h3>

          <p className="text-gray-500 text-sm">Share negative feedback</p>
        </div>

        {data.negatives.map((item, index) => (
          <input
            key={index}
            type="text"
            value={item}
            placeholder={`Negative Point ${index + 1}`}
            onChange={(e) => {
              const updated = [...data.negatives];

              updated[index] = e.target.value;

              updateData("negatives", updated);
            }}
            className="border border-[#A1A1A1] h-[50px] rounded-md px-5 outline-none"
          />
        ))}

        <button
          type="button"
          onClick={() => updateData("negatives", [...data.negatives, ""])}
          className="w-fit text-sm font-medium text-red-500"
        >
          + Add Negative Point
        </button>
      </div>

      <div className="flex flex-col gap-3">
        <div>
          <h3 className="text-lg font-semibold">Additional Comments</h3>

          <p className="text-gray-500 text-sm">
            Additional suggestions or comments
          </p>
        </div>

        <textarea
          rows={6}
          value={data.additionalComments}
          onChange={(e) => updateData("additionalComments", e.target.value)}
          placeholder="Enter comments..."
          className="border border-[#A1A1A1] rounded-xl p-5 outline-none resize-none"
        />
      </div>

      <button
        onClick={handleSubmit}
        className="w-fit bg-[#25C766] text-white py-3 px-6 rounded-lg text-md font-semibold"
      >
        Submit Feedback
      </button>

      {successOpen && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-2xl shadow-xl text-center">
            <h2 className="text-2xl font-semibold text-[#062732] mb-3">
              Feedback Submitted
            </h2>

            <p className="text-gray-500 mb-6">
              Thank you for completing the survey.
            </p>
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-2xl shadow-xl text-center">
            <h2 className="text-2xl font-semibold text-red-500 mb-2">Error</h2>

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
  );
}

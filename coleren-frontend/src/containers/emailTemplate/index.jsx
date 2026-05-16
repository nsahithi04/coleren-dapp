import DashboardLayout from "../../layout/dashboardLayout";
import MultiTagInput from "../../components/common/MultiTagInput";
import InviteDrop from "@/components/common/inviteDropdown";
import { useState, useEffect } from "react";
import { sendSurvey } from "../../services/surveyService";
import { auth } from "../../../firebase";
import { onAuthStateChanged } from "firebase/auth";

const TYPES = ["Sales Rep survey", "product feedback summary"];

export default function EmailTemplate() {
  const [data, setData] = useState({
    recipients: [],
    subject: "Invite to join coleren team",
    type: "Sales Rep survey",
    body: "Hi Welcome to the Product Survey shared with you byLorem ipsum dolor sit amet, consectetur adipiscing elit, se",
  });

  const [token, setToken] = useState("");

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

  const handleSubmit = async () => {
    try {
      console.log(data);
      await sendSurvey(data, token);
      console.log("Survey sent successfully");
    } catch (err) {
      console.log(err);
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

        {/* RECIPIENTS */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Recipients</label>

          <MultiTagInput
            value={data.recipients}
            onChange={(val) => updateData("recipients", val)}
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

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Survey Template</label>
          <InviteDrop
            value={data.type}
            placeholder="Select an option"
            onChange={(e) => updateData("type", e.target.value)}
            options={TYPES}
          />{" "}
        </div>

        {/* BODY */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Body</label>

          <textarea
            rows={12}
            className="border border-[#A1A1A1] rounded-xl p-6 outline-none resize-none"
            value={data.body}
            onChange={(e) => updateData("body", e.target.value)}
          />
        </div>

        {/* CTA */}
        <button
          onClick={handleSubmit}
          className="w-fit bg-[#25C766] text-white py-3 px-5 rounded-lg text-md font-semibold"
        >
          Submit
        </button>
      </div>
    </DashboardLayout>
  );
}

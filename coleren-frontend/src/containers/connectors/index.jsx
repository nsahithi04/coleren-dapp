import DashboardLayout from "../../layout/dashboardLayout";
import { useEffect, useState } from "react";
import { connectSalesforce } from "../../services/connectorService";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../../firebase";

export default function Connectors() {
  const [token, setToken] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) return;
      const t = await firebaseUser.getIdToken();
      setToken(t);
    });

    return () => unsubscribe();
  }, []);

  const handleSalesforce = async () => {
    try {
      const token = await auth.currentUser.getIdToken();

      const data = await connectSalesforce(token);

      console.log("uid from backend", data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[#F5FAF8] p-8">
        <h1 className="text-[28px] font-semibold text-[#062732] mb-8">
          Connectors
        </h1>

        <div className="bg-white border border-[#E7ECEA] rounded-2xl p-6 max-w-[900px]">
          <h2 className="text-lg font-semibold text-[#062732] mb-6">
            Available Connectors
          </h2>

          <div className="grid grid-cols-2 gap-5">
            <div className="border border-[#EEF2F1] rounded-xl p-5 hover:bg-[#F8FBFA] transition cursor-pointer">
              <div className="flex items-start justify-between">
                <div>
                  <div className="grid grid-cols-[auto_1fr] gap-5 items-center">
                    <img
                      className="h-10 w-10 p-2 border border-[#0000001A] rounded-lg"
                      src="salesforce.png"
                      alt="sales icons"
                    />
                    <h3 className="font-semibold text-[#062732]">Salesforce</h3>
                  </div>

                  <button
                    onClick={handleSalesforce}
                    className="mt-4 px-4 py-2 rounded-3xl bg-[#F8F8F8] text-[#062732] text-sm"
                  >
                    • Setup connector
                  </button>
                </div>

                <div className="h-7 w-7 rounded-full bg-[#EAF8F0] flex items-center justify-center text-[#24BC61] text-sm">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path
                      d="M7.5 15L12.5 10L7.5 5"
                      stroke="#24BC61"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="border border-[#EEF2F1] rounded-xl p-5 hover:bg-[#F8FBFA] transition cursor-pointer">
              <div className="flex items-start justify-between">
                <div>
                  <div className="grid grid-cols-[auto_1fr] gap-5 items-center">
                    <img
                      className="h-10 w-10 p-2 border border-[#0000001A] rounded-lg"
                      src="salesforce.png"
                      alt="sales icons"
                    />
                    <h3 className="font-semibold text-[#062732]">Teams</h3>
                  </div>
                  <button className="mt-4 px-4 py-2 rounded-3xl bg-[#F8F8F8] text-[#062732] text-sm">
                    • Setup connector
                  </button>
                </div>

                <div className="h-7 w-7 rounded-full bg-[#EAF8F0] flex items-center justify-center text-[#24BC61] text-sm">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path
                      d="M7.5 15L12.5 10L7.5 5"
                      stroke="#24BC61"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="border border-[#EEF2F1] rounded-xl p-5 hover:bg-[#F8FBFA] transition cursor-pointer">
              <div className="flex items-start justify-between">
                <div>
                  <div className="grid grid-cols-[auto_1fr] gap-5 items-center">
                    <img
                      className="h-10 w-10 p-2 border border-[#0000001A] rounded-lg"
                      src="salesforce.png"
                      alt="sales icons"
                    />
                    <h3 className="font-semibold text-[#062732]">Gmail</h3>
                  </div>
                  <button className="mt-4 px-4 py-2 rounded-3xl bg-[#F8F8F8] text-[#062732] text-sm">
                    • Setup connector
                  </button>
                </div>

                <div className="h-7 w-7 rounded-full bg-[#EAF8F0] flex items-center justify-center text-[#24BC61] text-sm">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path
                      d="M7.5 15L12.5 10L7.5 5"
                      stroke="#24BC61"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="border border-[#EEF2F1] rounded-xl p-5 hover:bg-[#F8FBFA] transition cursor-pointer">
              <div className="flex items-start justify-between">
                <div>
                  <div className="grid grid-cols-[auto_1fr] gap-5 items-center">
                    <img
                      className="h-10 w-10 p-2 border border-[#0000001A] rounded-lg"
                      src="salesforce.png"
                      alt="sales icons"
                    />
                    <h3 className="font-semibold text-[#062732]">Outlook</h3>
                  </div>
                  <button className="mt-4 px-4 py-2 rounded-3xl bg-[#F8F8F8] text-[#062732] text-sm">
                    • Setup connector
                  </button>
                </div>

                <div className="h-7 w-7 rounded-full bg-[#EAF8F0] flex items-center justify-center text-[#24BC61] text-sm">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path
                      d="M7.5 15L12.5 10L7.5 5"
                      stroke="#24BC61"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

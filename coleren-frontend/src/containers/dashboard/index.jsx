import DashboardLayout from "@/layouts/dashboard/index";
import { useState, useEffect } from "react";
import ScoreCard from "@/components/dashboard/scoreCard/index";
import { getDashboard } from "@/services/dashboardService";
import logo from "@/assets/icons/logo.svg";

function getScoreType(score, max) {
  const pct = (score / max) * 100;
  if (pct >= 70) return "strong";
  if (pct >= 40) return "avg";
  return "weak";
}

function growthLabel(pct) {
  if (pct === 0) return "No change";
  return pct > 0 ? `${pct}% growth` : `${Math.abs(pct)}% decline`;
}

function convertedLabel(pct) {
  if (pct === 0) return "No change";
  return pct > 0 ? `${pct}% higher` : `${Math.abs(pct)}% lower`;
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("production");
  const [activeIndex, setActiveIndex] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getDashboard();
        setData(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const productCards = [
    {
      title: "Product Market score",
      subtitle: "Product market fit",
      score: data?.product?.productMarketScore ?? 0,
      max: 10,
      responses: `${data?.product?.fitProducts ?? 0} responses`,
      type: getScoreType(data?.product?.productMarketScore ?? 0, 10),
      displayType: "ring",
    },
    {
      title: "Competitor score",
      subtitle: "Competitive product",
      score: data?.product?.competitorScore ?? 0,
      max: 10,
      responses: `${data?.product?.unfitProducts ?? 0} responses`,
      type: getScoreType(data?.product?.competitorScore ?? 0, 10),
      displayType: "ring",
    },
    {
      title: "Conversions rate",
      subtitle: "Demo converted to sale",
      score: data?.sales?.conversionRate ?? 0,
      max: 100,
      responses: `${data?.sales?.totalLeads ?? 0} leads`,
      type: getScoreType(data?.sales?.conversionRate ?? 0, 100),
      displayType: "ring",
    },
  ];

  const salesCards = [
    {
      title: "Monthly leads generated",
      subtitle: `For ${new Date().toLocaleString("default", { month: "short", year: "2-digit" })}`,
      score: data?.sales?.totalLeads ?? 0,
      max: 500,
      value: data?.sales?.totalLeads ?? 0,
      responses: growthLabel(data?.sales?.leadsGrowth ?? 0),
      type: getScoreType(data?.sales?.totalLeads ?? 0, 500),
      displayType: "bars",
    },
    {
      title: "Monthly leads converted",
      subtitle: `For ${new Date().toLocaleString("default", { month: "short", year: "2-digit" })}`,
      score: data?.sales?.converted ?? 0,
      max: data?.sales?.totalLeads || 100,
      value: data?.sales?.converted ?? 0,
      responses: convertedLabel(data?.sales?.convertedGrowth ?? 0),
      type: getScoreType(
        data?.sales?.converted ?? 0,
        data?.sales?.totalLeads || 100,
      ),
      displayType: "bars",
    },
    {
      title: "Conversion efficiency",
      subtitle: "Days spent per conversion",
      score: data?.sales?.conversionPerTime ?? 0,
      max: 10,
      responses: growthLabel(data?.sales?.efficiencyGrowth ?? 0),
      type: getScoreType(data?.sales?.conversionPerTime ?? 0, 10),
      displayType: "ring",
    },
    {
      title: "Monthly sales growth",
      subtitle: `For ${new Date().toLocaleString("default", { month: "short", year: "2-digit" })} compared to last month`,
      score: data?.sales?.conversionRate ?? 0,
      max: 100,
      value: data?.sales?.conversionRate ?? 0,
      responses: growthLabel(data?.sales?.salesGrowth ?? 0),
      type: getScoreType(data?.sales?.conversionRate ?? 0, 100),
      displayType: "bars",
    },
    {
      title: "Conversion per rep",
      subtitle: "Avg. leads converted per sales representative",
      score: data?.sales?.conversionPerRep ?? 0,
      max: 50,
      responses: `Best: ${data?.sales?.bestRep ?? 0}`,
      type: getScoreType(data?.sales?.conversionPerRep ?? 0, 50),
      displayType: "ring",
    },
  ];

  const scoreCards = activeTab === "production" ? productCards : salesCards;

  const main = activeTab === "production" ? "bg-[#24BC61]" : "bg-[#114354]";
  const prodActive =
    activeTab === "production"
      ? "bg-white shadow-lg p-2 w-full text-center rounded-md text-[#114354]"
      : "text-white px-2";
  const salesActive =
    activeTab === "sales"
      ? "bg-white shadow-lg p-2 w-full text-center rounded-md text-[#114354]"
      : "text-white px-2";

  if (loading)
    return (
      <DashboardLayout>
        <div className="p-10 text-gray-400">Loading...</div>
      </DashboardLayout>
    );

  return (
    <DashboardLayout>
      <div className="flex gap-5 h-full p-10">
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-10">
              <span className="text-xl font-semibold text-[#062732]">
                Dashboard
              </span>
              <div
                className={`${main} cursor-pointer grid grid-cols-[auto_auto] justify-items-center gap-1 p-1 font-semibold items-center text-lg rounded-lg`}
              >
                <div
                  className={`${salesActive}`}
                  onClick={() => setActiveTab("sales")}
                >
                  Sales
                </div>
                <div
                  className={`${prodActive}`}
                  onClick={() => setActiveTab("production")}
                >
                  Product
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 cursor-pointer hover:bg-gray-50">
              All Products
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M6 9l6 6 6-6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-5 mb-5">
            <p className="text-sm text-gray-500 mb-4">Representative Scores</p>
            <div className="grid grid-cols-3 gap-4">
              {scoreCards.map((card, i) => (
                <ScoreCard
                  key={i}
                  {...card}
                  isActive={activeIndex === i}
                  onClick={() => setActiveIndex(i)}
                />
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 w-full gap-5">
            <div className=" shadow-md p-5 bg-white rounded-lg grid grid-cols-[auto_1fr] gap-5 items-center">
              Conversation Trends <img src={logo} alt="Logo" className="w-10" />
            </div>
            <div className=" shadow-md p-5 bg-white rounded-lg">
              Recent activity
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

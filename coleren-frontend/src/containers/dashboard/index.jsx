import DashboardLayout from "../../layout/dashboardLayout";
import { useEffect, useState } from "react";
import { auth } from "../../../firebase";
import { dashboard } from "../../services/dashboardService";
import { onAuthStateChanged } from "firebase/auth";
import ScoreCard from "@/components/dashboard/scoreCard";

const getScoreType = (value, strong = 7, avg = 4) => {
  if (value >= strong) return "strong";
  if (value >= avg) return "avg";
  return "weak";
};

const getGrowthType = (value) => {
  if (value > 0) return "strong";
  if (value < 0) return "weak";
  return "avg";
};

const getGrowthLabel = (value) => {
  if (value > 0) return `${value.toFixed(1)}% growth`;
  if (value < 0) return `${Math.abs(value).toFixed(1)}% decrease`;
  return "0% change";
};

const SCORE_CONFIG = {
  product: { strong: 7, avg: 4 },
  conversion: { strong: 60, avg: 30 },
  rep: { strong: 7, avg: 4 },
};

export default function Dashboard() {
  const [displayData, setDisplayData] = useState(null);
  const [activeTab, setActiveTab] = useState("production");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) return;
      try {
        const token = await firebaseUser.getIdToken();
        const data = await dashboard(token);
        setDisplayData(data);
      } catch (err) {
        console.error(err);
      }
    });
    return () => unsubscribe();
  }, []);

  const avgConversionsPerRep = displayData?.avgConversionsPerRep || 0;
  const competitorScore = displayData?.product?.competitorScore || 0;
  const conversionRate = displayData?.product?.conversionRate || 0;
  const productMarketScore = displayData?.product?.productMarketScore || 0;
  const convertedLeads = displayData?.sales?.convertedLeads || 0;
  const totalLeads = displayData?.sales?.totalLeads || 0;
  const convertedmonthly = displayData?.monthly?.converted.current || 0;
  const growthconverted = displayData?.monthly?.converted.growth || 0;
  const leadsmonthly = displayData?.monthly?.leads.current || 0;
  const growthleads = displayData?.monthly?.leads.growth || 0;

  const label = new Date().toLocaleString("default", {
    month: "short",
    year: "numeric",
  });

  const main = activeTab === "production" ? "bg-[#24BC61]" : "bg-[#114354]";
  const prodActive =
    activeTab === "production"
      ? "bg-white shadow-lg py-2 px-4 w-full text-center rounded-md text-[#114354]"
      : "text-white px-2";
  const salesActive =
    activeTab === "sales"
      ? "bg-white shadow-lg py-2 px-4 w-full text-center rounded-md text-[#114354]"
      : "text-white px-2";

  return (
    <DashboardLayout>
      <div className="flex gap-5 h-full w-full p-10">
        <div className="grid grid-rows-[auto_auto_1fr] gap-5 w-full">
          <div className="grid grid-cols-[auto_1fr] gap-10 items-center">
            <span className="text-xl font-semibold text-[#062732]">
              Dashboard
            </span>
            <div
              className={`${main} w-fit cursor-pointer grid grid-cols-[auto_auto] justify-items-center gap-1 p-1 font-semibold items-center text-lg rounded-lg`}
            >
              <div
                className={salesActive}
                onClick={() => setActiveTab("sales")}
              >
                Sales
              </div>
              <div
                className={prodActive}
                onClick={() => setActiveTab("production")}
              >
                Product
              </div>
            </div>
          </div>

          <div className="w-full bg-white shadow-md rounded-xl border border-gray-100 p-5 ">
            <p className="text-sm text-gray-500 mb-4">Representative Scores</p>

            {activeTab === "production" && (
              <div className="grid grid-cols-3 gap-5">
                <ScoreCard
                  title="Product Market Score"
                  subtitle="Product market fit"
                  score={productMarketScore}
                  value={productMarketScore.toFixed(1)}
                  max={10}
                  displayType="ring"
                  type={getScoreType(
                    productMarketScore,
                    SCORE_CONFIG.product.strong,
                    SCORE_CONFIG.product.avg,
                  )}
                  responses="View details"
                />
                <ScoreCard
                  title="Competitor Score"
                  subtitle="Competitive product"
                  score={competitorScore}
                  value={competitorScore.toFixed(1)}
                  max={10}
                  displayType="ring"
                  type={getScoreType(
                    competitorScore,
                    SCORE_CONFIG.product.strong,
                    SCORE_CONFIG.product.avg,
                  )}
                  responses="View details"
                />
                <ScoreCard
                  title="Conversion Rate"
                  subtitle={`Demo converted to Sale ${label}`}
                  score={conversionRate}
                  value={`${conversionRate}%`}
                  max={100}
                  displayType="ring"
                  type={getScoreType(
                    conversionRate,
                    SCORE_CONFIG.conversion.strong,
                    SCORE_CONFIG.conversion.avg,
                  )}
                  responses="View details"
                />
              </div>
            )}

            {activeTab === "sales" && (
              <div className="grid grid-cols-3 gap-5">
                <ScoreCard
                  title="Total Leads"
                  subtitle="Leads generated"
                  score={totalLeads}
                  value={totalLeads}
                  max={100}
                  displayType="bars"
                  type={getScoreType(totalLeads, 70, 30)}
                  responses="View details"
                />
                <ScoreCard
                  title="Conversion Rate"
                  subtitle="Leads converted"
                  score={convertedLeads}
                  value={`${convertedLeads.toFixed(0)}%`}
                  max={100}
                  displayType="ring"
                  type={getScoreType(
                    convertedLeads,
                    SCORE_CONFIG.conversion.strong,
                    SCORE_CONFIG.conversion.avg,
                  )}
                  responses="View details"
                />
                <ScoreCard
                  title="Monthly Leads"
                  subtitle={`for ${label}`}
                  score={leadsmonthly}
                  value={leadsmonthly}
                  max={100}
                  displayType="bars"
                  type={getGrowthType(growthleads)}
                  responses={getGrowthLabel(growthleads)}
                />
                <ScoreCard
                  title="Monthly Conversions"
                  subtitle={`for ${label}`}
                  score={convertedmonthly}
                  value={convertedmonthly}
                  max={100}
                  displayType="bars"
                  type={getGrowthType(growthconverted)}
                  responses={getGrowthLabel(growthconverted)}
                />
                <ScoreCard
                  title="Conversions per rep"
                  subtitle="Avg. leads converted per rep"
                  score={avgConversionsPerRep}
                  value={avgConversionsPerRep.toFixed(1)}
                  max={10}
                  displayType="ring"
                  type={getScoreType(
                    avgConversionsPerRep,
                    SCORE_CONFIG.rep.strong,
                    SCORE_CONFIG.rep.avg,
                  )}
                  responses="View details"
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div className="w-full bg-white shadow-md rounded-xl border border-gray-100 p-5">
              <p className="text-sm text-gray-500 mb-4">
                Representative Scores
              </p>
            </div>
            <div className="w-full bg-white shadow-md rounded-xl border border-gray-100 p-5">
              <p className="text-sm text-gray-500 mb-4">
                Representative Scores
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

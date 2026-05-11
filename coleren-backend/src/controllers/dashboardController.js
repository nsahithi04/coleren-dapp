import Lead from "../models/Lead.js";
import Product from "../models/Product.js";
import User from "../models/User.js";

export const getDashboard = async (req, res) => {
  try {
    const firebaseUid = req.user.uid;
    const user = await User.findOne({ firebaseUid });
    const userId = user._id;

    const now = new Date();

    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    const [leads, products] = await Promise.all([
      Lead.find({ userId }),
      Product.find({ userId }),
    ]);

    const totalLeads = leads.length;
    const convertedLeads = leads.filter((l) => l.outcome === "WIN").length;

    const conversionRate =
      totalLeads === 0
        ? 0
        : Number(((convertedLeads / totalLeads) * 100).toFixed(1));

    const totalProductScore = products.reduce(
      (sum, p) => sum + (p.productMarketFitScore || 0),
      0,
    );

    const totalCompetitorScore = products.reduce(
      (sum, p) => sum + (p.competitorScore || 0),
      0,
    );

    const avgProductMarketScore =
      products.length === 0
        ? 0
        : Number((totalProductScore / products.length).toFixed(1));

    const avgCompetitorScore =
      products.length === 0
        ? 0
        : Number((totalCompetitorScore / products.length).toFixed(1));

    const thisMonthLeads = leads.filter((l) => l.createdAt >= startOfThisMonth);

    const lastMonthLeads = leads.filter(
      (l) => l.createdAt >= startOfLastMonth && l.createdAt <= endOfLastMonth,
    );

    const monthlyLeads = thisMonthLeads.length;
    const lastMonthLeadsCount = lastMonthLeads.length;

    const leadsGrowth =
      lastMonthLeadsCount === 0
        ? 0
        : Number(
            (
              ((monthlyLeads - lastMonthLeadsCount) / lastMonthLeadsCount) *
              100
            ).toFixed(1),
          );

    const thisMonthConverted = thisMonthLeads.filter(
      (l) => l.outcome === "WIN",
    );

    const lastMonthConverted = lastMonthLeads.filter(
      (l) => l.outcome === "WIN",
    );

    const monthlyConverted = thisMonthConverted.length;
    const lastMonthConvertedCount = lastMonthConverted.length;

    const conversionGrowth =
      lastMonthConvertedCount === 0
        ? 0
        : Number(
            (
              ((monthlyConverted - lastMonthConvertedCount) /
                lastMonthConvertedCount) *
              100
            ).toFixed(1),
          );

    const repMap = {};

    thisMonthLeads.forEach((lead) => {
      const rep = lead.representativeName || "Unknown";

      if (!repMap[rep]) {
        repMap[rep] = { total: 0, converted: 0 };
      }

      repMap[rep].total += 1;

      if (lead.outcome === "WIN") {
        repMap[rep].converted += 1;
      }
    });

    const repEntries = Object.values(repMap);

    const totalConversionsAllReps = repEntries.reduce(
      (sum, rep) => sum + rep.converted,
      0,
    );

    const numberOfReps = repEntries.length;

    const avgConversionsPerRep =
      numberOfReps === 0
        ? 0
        : Number((totalConversionsAllReps / numberOfReps).toFixed(1));

    const monthlyStats = Array.from({ length: 12 }, (_, index) => {
      const monthStart = new Date(now.getFullYear(), index, 1);

      const monthEnd = new Date(now.getFullYear(), index + 1, 0, 23, 59, 59);

      const monthLeads = leads.filter(
        (lead) => lead.createdAt >= monthStart && lead.createdAt <= monthEnd,
      );

      const monthConverted = monthLeads.filter(
        (lead) => lead.outcome === "WIN",
      );

      return {
        month: monthStart.toLocaleString("default", {
          month: "short",
        }),

        leads: monthLeads.length,

        converted: monthConverted.length,
      };
    });

    res.json({
      product: {
        productMarketScore: avgProductMarketScore,
        competitorScore: avgCompetitorScore,
        conversionRate,
      },
      sales: {
        totalLeads,
        convertedLeads,
      },
      monthly: {
        leads: {
          current: monthlyLeads,
          growth: leadsGrowth,
        },
        converted: {
          current: monthlyConverted,
          growth: conversionGrowth,
        },
      },
      avgConversionsPerRep,

      details: {
        leads: leads.slice(0, 10),
        products: products.slice(0, 10),
        thisMonthLeads: thisMonthLeads.slice(0, 10),
        lastMonthLeads: lastMonthLeads.slice(0, 10),
        thisMonthConverted: thisMonthConverted.slice(0, 10),
        lastMonthConverted: lastMonthConverted.slice(0, 10),
        totalLeadsConverted: leads
          .filter((l) => l.outcome === "WIN")
          .slice(0, 10),
        yearlyStats: monthlyStats,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Dashboard error" });
  }
};

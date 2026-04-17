import User from "../models/User.js";
import Profile from "../models/Profile.js";
import Lead from "../models/Lead.js";
import Meeting from "../models/Meeting.js";
import Product from "../models/Product.js";

function getMonthRange(monthsAgo = 0) {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth() - monthsAgo, 1);
  const end = new Date(
    now.getFullYear(),
    now.getMonth() - monthsAgo + 1,
    0,
    23,
    59,
    59,
  );
  return { start, end };
}

function growthPct(current, previous) {
  if (!previous) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100);
}

export const getDashboardStats = async (req, res, next) => {
  try {
    const firebaseUid = req.user.uid;
    const user = await User.findOne({ firebaseUid });
    const profile = await Profile.findOne({ userId: user._id });
    const profileId = profile._id;

    const { start: thisStart, end: thisEnd } = getMonthRange(0);
    const { start: lastStart, end: lastEnd } = getMonthRange(1);

    // ── LEADS ─────────────────────────────────────────────────────────────────
    const allLeads = await Lead.find({ profile: profileId });
    const thisMonthLeads = allLeads.filter(
      (l) => l.createdAt >= thisStart && l.createdAt <= thisEnd,
    );
    const lastMonthLeads = allLeads.filter(
      (l) => l.createdAt >= lastStart && l.createdAt <= lastEnd,
    );

    const totalLeads = thisMonthLeads.length;
    const lastTotalLeads = lastMonthLeads.length;
    const leadsGrowth = growthPct(totalLeads, lastTotalLeads);

    const converted = thisMonthLeads.filter(
      (l) => l.phase === "converted",
    ).length;
    const lastConverted = lastMonthLeads.filter(
      (l) => l.phase === "converted",
    ).length;
    const convertedGrowth = growthPct(converted, lastConverted);

    const conversionRate = totalLeads
      ? Math.round((converted / totalLeads) * 100)
      : 0;

    // ── MEETINGS / EFFICIENCY ─────────────────────────────────────────────────
    const meetings = await Meeting.find({ profile: profileId });
    const thisMonthMeetings = meetings.filter(
      (m) => m.createdAt >= thisStart && m.createdAt <= thisEnd,
    );
    const lastMonthMeetings = meetings.filter(
      (m) => m.createdAt >= lastStart && m.createdAt <= lastEnd,
    );

    const totalDuration = thisMonthMeetings.reduce(
      (sum, m) => sum + (m.duration || 0),
      0,
    );
    const lastDuration = lastMonthMeetings.reduce(
      (sum, m) => sum + (m.duration || 0),
      0,
    );

    const conversionPerTime = totalDuration
      ? parseFloat((converted / totalDuration).toFixed(2))
      : 0;
    const lastConversionPerTime = lastDuration
      ? parseFloat((lastConverted / lastDuration).toFixed(2))
      : 0;
    const efficiencyGrowth = growthPct(
      conversionPerTime,
      lastConversionPerTime,
    );

    // ── SALES GROWTH (conversion rate month over month) ───────────────────────
    const lastConversionRate = lastTotalLeads
      ? Math.round((lastConverted / lastTotalLeads) * 100)
      : 0;
    const salesGrowth = growthPct(conversionRate, lastConversionRate);

    // ── CONVERSION PER REP ────────────────────────────────────────────────────
    const repMap = {};
    thisMonthLeads
      .filter((l) => l.phase === "converted")
      .forEach((l) => {
        const rep = l.representative?.toString();
        if (rep) repMap[rep] = (repMap[rep] || 0) + 1;
      });
    const repCounts = Object.values(repMap);
    const bestRep = repCounts.length ? Math.max(...repCounts) : 0;
    const conversionPerRep = repCounts.length
      ? parseFloat(
          (repCounts.reduce((a, b) => a + b, 0) / repCounts.length).toFixed(1),
        )
      : 0;

    // ── PRODUCTS ──────────────────────────────────────────────────────────────
    const products = await Product.find({ profile: profileId });
    const assessed = products.filter((p) => p.fit !== null);
    const fitCount = assessed.filter((p) => p.fit === true).length;
    const unfitCount = assessed.filter((p) => p.fit === false).length;
    const assessedCount = assessed.length;

    const productMarketScore = assessedCount
      ? parseFloat(((fitCount / assessedCount) * 10).toFixed(1))
      : 0;
    const competitorScore = assessedCount
      ? parseFloat(((unfitCount / assessedCount) * 10).toFixed(1))
      : 0;

    res.json({
      sales: {
        totalLeads,
        leadsGrowth, // % vs last month
        converted,
        convertedGrowth, // % vs last month (higher/lower)
        conversionRate,
        conversionPerTime,
        efficiencyGrowth, // % vs last month
        salesGrowth, // % vs last month
        conversionPerRep,
        bestRep,
      },
      product: {
        totalProducts: products.length,
        assessedProducts: assessedCount,
        fitProducts: fitCount,
        unfitProducts: unfitCount,
        productMarketScore,
        competitorScore,
      },
    });
  } catch (err) {
    next(err);
  }
};

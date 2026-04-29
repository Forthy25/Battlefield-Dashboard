import express from "express";
import { calculateStats, topMapsKD, graphKD } from "../utils/dashboardUtils.js";
import { generateMockMatches } from "../sampleData.js";

const router = express.Router();

// Dashboard home - Demo with mock data
router.get("/", async (req, res) => {
  try {
    const mockMatches = await generateMockMatches(150);
    const overallStats = calculateStats(mockMatches);
    const recentMatches = mockMatches.slice(0, 10);
    const recentStats = calculateStats(recentMatches);
    const topMaps = topMapsKD(mockMatches);
    const kdGraphData = graphKD(mockMatches.slice(0, 25).reverse());

    res.render("index", {
      currentUser: { username: "Demo User" },
      kdRatio: overallStats.kdRatio,
      winRate: overallStats.winRate,
      averageScore: overallStats.averageScore,
      gamesPlayed: mockMatches.length,
      recentKdRatio: recentStats.kdRatio,
      recentWinRate: recentStats.winRate,
      recentAverageScore: recentStats.averageScore,
      topMaps: topMaps,
      recentMatches: recentMatches,
      kdGraphData: kdGraphData,
    });
  } catch (error) {
    console.error("Error loading dashboard:", error);
    res.status(500).send("Error loading dashboard");
  }
});

export default router;

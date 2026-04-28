import express from "express";
import Match from "../models/Match.js";
import User from "../models/User.js";
import { isAuthenticatedRender } from "../utils/authMiddleware.js";
import { calculateStats, topMapsKD, graphKD } from "../utils/dashboardUtils.js";

const router = express.Router();

// Dashboard home page
router.get("/", isAuthenticatedRender, async (req, res) => {
  try {
    // Get current user
    const currentUser = await User.findById(req.session.userId).select(
      "username role",
    );

    // Get matches sorted by ID (newest first)
    const matches = await Match.find({ user: req.session.userId }).sort({
      _id: -1,
    });

    // Calculate dashboard statistics
    const overallStats = calculateStats(matches);

    // Calculate stats for 10 recent matches
    const recentMatches = matches.slice(0, 10); // 10 most recent matches
    const recentStats = calculateStats(recentMatches);

    // Calculate KD ratio for graphs (capped at 25)
    const last25Matches = matches.slice(0, 25).reverse(); // Last 25 matches
    const kdGraphData = graphKD(last25Matches);

    const gamesPlayed = matches.length;

    res.render("index", {
      currentUser,
      matches,
      ...overallStats,
      recentMatches,
      recentKdRatio: recentStats.kdRatio,
      recentWinRate: recentStats.winRate,
      recentAverageScore: recentStats.averageScore,
      topMaps: topMapsKD(matches),
      kdGraphData,
      gamesPlayed,
    });
  } catch (error) {
    console.error("Error fetching matches:", error);
    res.status(500).send("Error fetching matches");
  }
});

export default router;

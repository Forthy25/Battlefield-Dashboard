import express from "express";
import Match from "../models/Match.js";
import { isAuthenticated } from "../utils/authMiddleware.js";

const router = express.Router();

// Validate match data
function validateMatchData(data) {
  const errors = [];

  // Check required fields
  if (
    data.score === undefined ||
    typeof data.score !== "number" ||
    data.score < 0
  ) {
    errors.push("score must be a non-negative number");
  }
  if (
    data.kills === undefined ||
    typeof data.kills !== "number" ||
    data.kills < 0
  ) {
    errors.push("kills must be a non-negative number");
  }
  if (
    data.deaths === undefined ||
    typeof data.deaths !== "number" ||
    data.deaths < 0
  ) {
    errors.push("deaths must be a non-negative number");
  }
  if (!data.map || typeof data.map !== "string") {
    errors.push("map is required and must be a string");
  }
  if (!data.mode || typeof data.mode !== "string") {
    errors.push("mode is required and must be a string");
  }
  if (data.win === undefined || typeof data.win !== "boolean") {
    errors.push("win is required and must be a boolean");
  }

  return errors;
}

// Get all matches for current user
router.get("/", isAuthenticated, async (req, res) => {
  try {
    const matches = await Match.find({ user: req.session.userId });
    res.json(matches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get match by ID (own matches only)
router.get("/:id", isAuthenticated, async (req, res) => {
  try {
    const match = await Match.findOne({
      _id: req.params.id,
      user: req.session.userId,
    });
    if (!match) {
      return res.status(404).json({ message: "Match not found or not yours" });
    }
    res.json(match);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new match
router.post("/", isAuthenticated, async (req, res) => {
  try {
    // Validation
    const errors = validateMatchData(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ message: "Validation failed", errors });
    }

    const newMatch = new Match({
      ...req.body,
      user: req.session.userId, // Assign current user from session
    });
    await newMatch.save();
    res.json(newMatch);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete match
router.delete("/:id", isAuthenticated, async (req, res) => {
  try {
    const match = await Match.findOne({
      _id: req.params.id,
      user: req.session.userId,
    });
    if (!match) {
      return res.status(404).json({ message: "Match not found or not yours" });
    }
    await Match.deleteOne({ _id: req.params.id });
    res.json({ message: "Match deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update match
router.put("/:id", isAuthenticated, async (req, res) => {
  try {
    // Validation
    const errors = validateMatchData(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ message: "Validation failed", errors });
    }

    const match = await Match.findById(req.params.id);
    if (!match) {
      return res.status(404).json({ message: "Match not found" });
    }
    // Check if match belongs to current user
    if (match.user.toString() !== req.session.userId) {
      return res.status(403).json({ message: "Forbidden" });
    }
    Object.assign(match, req.body);
    await match.save();
    res.json(match);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

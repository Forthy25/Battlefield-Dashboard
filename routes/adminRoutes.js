import express from "express";
import User from "../models/User.js";
import {
  isAuthenticated,
  isAuthenticatedRender,
  isAdmin,
} from "../utils/authMiddleware.js";

const router = express.Router();

// Admin panel
router.get("/admin", isAuthenticatedRender, isAdmin, async (req, res) => {
  try {
    // Count total users for display in admin panel
    const totalUsers = await User.countDocuments();

    const users = await User.find()
      .select("username email role")
      .sort({ role: 1, username: 1 });

    res.render("admin", {
      users,
      totalUsers,
      currentUser: req.session,
    });
  } catch (error) {
    console.error("Error fetching admin panel:", error);
    res.status(500).send("Error fetching admin panel");
  }
});

// Delete user
router.delete("/users/:id", isAuthenticated, isAdmin, async (req, res) => {
  try {
    // Admin cannot delete their own account
    if (req.params.id === req.session.userId) {
      return res
        .status(403)
        .json({ message: "You cannot delete your own account" });
    }

    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.sendStatus(200);
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).send("Error deleting user");
  }
});

// Get user by ID (for modal)
router.get("/users/:id", isAuthenticated, isAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Error fetching user" });
  }
});

// Update user
router.put("/users/:id", isAuthenticated, isAdmin, async (req, res) => {
  try {
    const { username, email, role } = req.body;

    // Validation
    if (!username || !email || !role) {
      return res
        .status(400)
        .json({ message: "username, email, and role are required" });
    }

    if (!["user", "admin"].includes(role)) {
      return res
        .status(400)
        .json({ message: "role must be 'user' or 'admin'" });
    }

    // Check for duplicates (except for current user)
    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
      _id: { $ne: req.params.id },
    });

    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Username or email already exists" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { username, email, role },
      { new: true },
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).send("Error updating user");
  }
});

export default router;

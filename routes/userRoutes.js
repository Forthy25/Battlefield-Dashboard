import express from "express";
import bcrypt from "bcrypt";
import User from "../models/User.js";

const router = express.Router();

router.get("/register", (req, res) => {
  res.render("register");
});

// Create new user
router.post("/register", async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    // Check if username or email already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Username or email already exists" });
    }
    // Create new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role: role || "user",
    });
    await newUser.save();

    // Differentiate between admin panel creation and user self-registration
    if (req.is("json") || req.headers.accept?.includes("application/json")) {
      res.json({ message: "User created successfully", user: newUser });
    } else {
      res.redirect("/login");
    }
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Error registering user" });
  }
});

router.get("/login", (req, res) => {
  res.render("login", { error: null });
});

// Verify login credentials
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res
        .status(400)
        .render("login", { error: "Invalid username or password" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res
        .status(400)
        .render("login", { error: "Invalid username or password" });
    }

    req.session.userId = user._id; // Save session
    req.session.role = user.role; // Get user role

    res.redirect("/");
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).send("Error logging in user");
  }
});

// Logout
router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error logging out user:", err);
      return res.status(500).send("Error logging out user");
    }
    res.redirect("/login");
  });
});

export default router;

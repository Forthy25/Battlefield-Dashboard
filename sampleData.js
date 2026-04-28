import mongoose from "mongoose";
import Match from "./models/Match.js";
import User from "./models/User.js";
import dotenv from "dotenv";
dotenv.config();

async function generateData() {
  await mongoose.connect(process.env.MONGODB_URI);

  const maps = [
    "Contaminated",
    "Operation Firestorm",
    "Eastwood",
    "Mirak Valley",
    "Iberian Offensive",
    "Manhattan Bridge",
    "Liberation Peak",
    "Siege of Kairo",
  ];
  const modes = ["Conquest", "Escalation"];

  const startDate = new Date("2026-02-23");
  const endDate = new Date("2026-03-13");

  const matches = [];
  const users = await User.find(); // Get all users from database
  for (let i = 0; i < 150; i++) {
    const randomDate = new Date(
      startDate.getTime() +
        Math.random() * (endDate.getTime() - startDate.getTime()),
    );
    const randomMap = maps[Math.floor(Math.random() * maps.length)];
    const randomMode = modes[Math.floor(Math.random() * modes.length)];
    const randomUser = users[Math.floor(Math.random() * users.length)];

    matches.push({
      kills: Math.floor(Math.random() * (50 - 16 + 1)) + 16,
      deaths: Math.floor(Math.random() * (20 - 3 + 1)) + 3,
      score: Math.floor(Math.random() * (15000 - 7000 + 1)) + 7000,
      map: randomMap,
      mode: randomMode,
      win: Math.random() < 0.5,
      date: randomDate,
      user: randomUser._id, // Assign all matches to random user
    });
  }
  matches.sort((a, b) => a.date - b.date);

  await Match.insertMany(matches);
  console.log("Sample data generated and inserted into MongoDB");
  mongoose.connection.close();
}

generateData();

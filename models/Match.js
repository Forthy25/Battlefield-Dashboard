import mongoose from "mongoose";

const matchSchema = new mongoose.Schema({
  score: Number,
  kills: Number,
  deaths: Number,
  map: String,
  mode: String,
  win: Boolean,
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  date: { type: Date, default: Date.now },
});

const Match = mongoose.model("Match", matchSchema);

export default Match;

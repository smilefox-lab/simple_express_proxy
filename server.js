import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();

const MS_IN_DAY = 24 * 60 * 60 * 1000;
const parseTimerTarget = () => {
  const baseDateString = process.env.LEADERBOARD_TIMER_BASE_DATE;
  const durationFromEnv = Number(process.env.LEADERBOARD_TIMER_DURATION_DAYS);

  if (baseDateString) {
    const baseDate = new Date(baseDateString);
    if (!Number.isNaN(baseDate.getTime())) {
      const targetDate = new Date(baseDate.getTime() + durationFromEnv * MS_IN_DAY);
      return targetDate;
    }
    console.warn(`Invalid LEADERBOARD_TIMER_BASE_DATE value "${baseDateString}", falling back to duration.`);
  }

  const durationDays = durationFromEnv > 0 ? durationFromEnv : 50;
  return new Date(Date.now() + durationDays * MS_IN_DAY);
};

const timerTargetDate = parseTimerTarget();

const applyCors = (res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
};

app.get("/leaderboard", async (req, res) => {
  const apiUrl = `https://api.skinrave.gg/affiliates/public/applicants?token=${process.env.API_TOKEN}&skip=0&take=15&order=DESC&from=2025-09-04T16:50:33.697Z&to=2025-09-11T16:50:33.697Z`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    applyCors(res);
    res.json(data);
  } catch (err) {
    applyCors(res);
    res.status(500).json({ error: err.toString() });
  }
});

app.get("/leaderboard/timer", (req, res) => {
  const now = new Date();
  const msRemaining = timerTargetDate.getTime() - now.getTime();

  applyCors(res);
  res.json({
    target: timerTargetDate.toISOString(),
    now: now.toISOString(),
    secondsRemaining: msRemaining > 0 ? Math.floor(msRemaining / 1000) : 0,
    expired: msRemaining <= 0,
  });
});

app.listen(5000, () => console.log("Proxy running at http://localhost:5000"));

import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.get("/leaderboard", async (req, res) => {
  const apiUrl = `https://api.skinrave.gg/affiliates/public/applicants?token=${process.env.API_TOKEN}&skip=0&take=15&order=DESC&from=2025-09-04T16:50:33.697Z&to=2025-09-11T16:50:33.697Z`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.toString() });
  }
});

app.listen(5000, () => console.log("Proxy running at http://localhost:5000"));

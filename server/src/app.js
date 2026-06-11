const express = require("express");
const cors = require("cors");
const corsConfig = require("./config/cors");
const path = require("path");

const app = express();

app.use(cors(corsConfig));
app.use(express.json());

// static frontend
app.use(express.static(path.join(__dirname, "../../client")));

app.get("/", (req, res) => {
  res.send("Reflecta server running");
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

module.exports = app;
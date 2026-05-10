const express = require("express");
const cors = require("cors");
const { corsOrigin } = require("./src/config/env");
const healthRoutes = require("./src/routes/healthRoutes");
const userRoutes = require("./src/routes/userRoutes");

const app = express();

app.use(
  cors({
    origin: corsOrigin
  })
);
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "WanderNest backend is running"
  });
});

app.use("/api/health", healthRoutes);
app.use("/api/users", userRoutes);

app.use((err, req, res, next) => {
  console.error(err);

  res.status(500).json({
    message: "Internal server error"
  });
});

module.exports = app;

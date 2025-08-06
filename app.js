const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");

const authRoutes = require("./routes/authRoutes");

const app = express();
const PORT = 8888;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Serve static files from frontend folder
app.use(express.static(path.join(__dirname, "../frontend")));

// API routes
app.use("/api", authRoutes);

app.get("*", (req, res, next) => {
  if (req.path.includes(".") || req.path.startsWith("/api")) {
    return next();
  }
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

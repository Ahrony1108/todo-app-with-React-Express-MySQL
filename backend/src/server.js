const express = require("express");
const cors = require("cors");
require("dotenv").config();

const todoRoutes = require("./routes/todos");

const app = express();
const PORT = Number(process.env.PORT || 5000);

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Todo API is running", status: "ok" });
});

app.get("/health", (req, res) => {
  res.json({ status: "healthy" });
});

app.use("/api/todos", todoRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Backend server running on port ${PORT}`);
});
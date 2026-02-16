import express from "express";
import userRoutes from "./routes/user.routes.js";

const app = express();

app.use(express.json());

app.use("/api/users", userRoutes);

app.get("/health", (req, res) => {
  res.status(200).json({ status: "UP" });
});

export default app;

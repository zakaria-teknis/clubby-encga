import dotenv from "dotenv";
import express from "express";
import { connectDB } from "./config/db.js";
import userRoutes from "./routes/user.route.js";
import cors from "cors";
import dashboardRoutes from "./routes/dashboard/dashboard.route.js";
import publicRoutes from "./routes/public/public.route.js";
import "./utlities/cleanUp.utility.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

const PORT = process.env.PORT || 5000;

// middleware
app.use(express.json());

// routes
app.use("/api/user", userRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/public", publicRoutes);

// global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// connect to db
(async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server started at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Failed to connect to the database", err);
    process.exit(1);
  }
})();

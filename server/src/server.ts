import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth";
import taskRoutes from "./routes/task";

dotenv.config();

const app = express();
app.use(cors({
  origin: "*"
}));

app.use(express.json());


app.use("/api/auth", authRoutes);
app.use("/api/task", taskRoutes);

app.get("/", (_req, res) => {
  res.send("TaskForge Backend API is running 🚀");
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

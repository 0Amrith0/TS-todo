import express, { Application } from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";

import notesRoutes from "./routes/notes.routes";
import authRoutes from "./routes/auth.routes";
import { connectDB } from "./config/db.js";

dotenv.config();

const app: Application = express();
const PORT: number = parseInt(process.env.PORT || "5000", 10);


app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); 


app.use("/api/notes", notesRoutes); 
app.use("/api/auth", authRoutes);

if (process.env.NODE_ENV === "production") {
  const frontendPath = path.join(__dirname, "../../frontend/dist");
  app.use(express.static(frontendPath));

  app.get("/*", (req, res) => {
    res.sendFile(path.resolve(frontendPath, "index.html"));
  });
}

app.listen(PORT, async () => {
  try {
    await connectDB();
    console.log(`Server started on http://localhost:${PORT}`);
  } catch (error) {
    console.error("Failed to connect to database", error);
    process.exit(1);
  }
});
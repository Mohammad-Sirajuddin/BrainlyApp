import express from "express";
import cors from "cors";
import routes from "./routes/routes.js";
import * as nodeDns from "node:dns";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Use the alias 'nodeDns' to set the servers
nodeDns.setServers(["8.8.8.8", "8.8.4.4"]);

const app = express();
const PORT = process.env.PORT || 3000;

// Configure CORS to allow requests from your frontend
app.use(
  cors({
    origin: [
      "http://localhost:5173", // Local development
      "https://brainly-app-bice.vercel.app", // Replace with your actual frontend URL
    ],
    credentials: true,
  }),
);

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

app.use(express.json());

app.use("/api/v1", routes);

app.listen(PORT, () => {
  console.log(`Server Running on port ${PORT}!`);
});


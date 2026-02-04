import express from "express";
import cors from "cors";
import routes from "./routes/routes.js";
import * as nodeDns from "node:dns";

// Use the alias 'nodeDns' to set the servers
nodeDns.setServers(["8.8.8.8", "8.8.4.4"]);

const app = express();
// Configure CORS to allow requests from your frontend
app.use(
  cors({
    origin: "http://localhost:5173", // Your frontend URL
    credentials: true,
  }),
);

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  console.log("Headers:", req.headers);
  console.log("Body:", req.body);
  next();
});

app.use(express.json());

// Debug route to test
app.get("/test", (req, res) => {
  res.json({ message: "Backend is working!" });
});

app.use("/api/v1", routes);

app.listen(3000, () => {
  console.log("Server Running on port 3000!");
});

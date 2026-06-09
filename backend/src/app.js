import express from "express";
import cors from "cors";
import messageRoute from "./routes/chat.routes.js";

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);

app.use("/api/message", messageRoute);

export default app;

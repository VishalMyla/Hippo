import "./types/express-augmentations";
import express, { NextFunction, Request, Response } from "express";
import { createServer } from "http";
import cors from "cors";
import userRoutes from "./routes/userRoutes";
import roomRoutes from "./routes/roomRoutes";
import { initWebSocket } from "./wsHandler";
import morgan from "morgan";
import path from "path";
import { rateLimit } from "express-rate-limit";
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 50,
  standardHeaders: "draft-8",
  legacyHeaders: false,
});

const rfs = require("rotating-file-stream");

const app = express();

app.set("trust proxy", 1);

//logs
const logDir = path.join(__dirname, "logs");

const logStream = rfs.createStream("requestLogs.log", {
  interval: "1d",
  path: logDir,
});

//cors

const allowedOrigins = [
  "https://Hippio-frontend.vercel.app",
  "http://localhost:3000",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(limiter);
app.use(morgan("common", { stream: logStream }));
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ msg: "hello there" });
});

app.use("/user", userRoutes);
app.use("/room", roomRoutes);

const PORT: number = parseInt(process.env.PORT ?? "8081", 10);
const server = createServer(app);

// Initialize the WebSocket logic on the shared HTTP server
initWebSocket(server);

server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

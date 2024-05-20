import express from "express";
import { config } from "dotenv";
import logger from "morgan";
import cors from "cors";
import { rateLimit } from "express-rate-limit";
import authRoutes from "./routes/auth.routes.js";
import taskRoutes from "./routes/tasks.routes.js";
import {
  error404Middleware,
  errorMiddleware,
} from "./middlewares/error.middlewares.js";
import cookieParser from "cookie-parser";
config();

const app = express();

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  limit: 20,
  standardHeaders: "draft-7",
  legacyHeaders: false,
});

app.set("port", process.env.PORT);

// middlewares

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(logger("dev"));
app.use(cors());
app.use(limiter);
app.use(cookieParser());

// routing middlewares

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

app.use(error404Middleware); // page not found error middleware
app.use(errorMiddleware); // server error middleware

export default app;

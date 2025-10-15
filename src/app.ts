import express, { Express, Request, Response } from "express";
import userRoutes from "./api/v1/routes/userRoutes";
import adminRoutes from "./api/v1/routes/adminRoutes";
import errorHandler from "./api/v1/middleware/errorHandler";
import {
  accessLogger,
  errorLogger,
  consoleLogger,
} from "./api/v1/middleware/logger";

// initialize the express application
const app: Express = express();
/**
 * Interface describing the health check response payload.
 */
interface HealthCheckResponse {
  status: string;
  uptime: number;
  timestamp: string;
  version: string;
}

// 1) Logging
if (process.env.NODE_ENV === "production") {
  app.use(accessLogger);
  app.use(errorLogger);
} else {
  app.use(consoleLogger);
}

// 2) JSON body parser
app.use(express.json());

// 3) Routes
/**
 * Health check endpoint that returns server status information.
 */
app.get("/api/v1/health", (_req: Request, res: Response) => {
  const healthData: HealthCheckResponse = {
    status: "OK",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  };
  res.json(healthData);
});

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/admin", adminRoutes);

// NOTE: add loans when ready:
// import loanRoutes from "./api/v1/routes/loanRoutes";
// app.use("/api/v1/loans", loanRoutes);

// 4) Global error handler (MUST be last)
app.use(errorHandler);

export default app;

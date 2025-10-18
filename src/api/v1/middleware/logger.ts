/**
 * Logging middleware.
 *
 * Access logs  - Every incoming request to the application.
 * Error logs   - Only requests that resulted in 4XX or 5XX status codes.
 * Console logs - Immediate, developer-friendly feedback.
 */

import morgan, { StreamOptions } from "morgan";
import fs, { WriteStream } from "fs";
import path from "path";
import { Response, Request } from "express";

// Ensure the logs directory exists: src/logs
const logsDirectory: string = path.join(__dirname, "../../../logs");
if (!fs.existsSync(logsDirectory)) {
    fs.mkdirSync(logsDirectory, { recursive: true });
}

// Access log write stream (append mode)
const accessLogStream: WriteStream = fs.createWriteStream(
    path.join(logsDirectory, "access.log"),
    { flags: "a" }
);

// Error log write stream (append via StreamOptions.write)
const errorLogStream: StreamOptions = {
    write: (message: string): void => {
        fs.appendFileSync(path.join(logsDirectory, "error.log"), message);
    },
};

// Log all requests to access.log
const accessLogger = morgan("combined", { stream: accessLogStream });

// Log only failed requests (status >= 400) to error.log
const errorLogger = morgan("combined", {
    stream: errorLogStream,
    skip: (_req: Request, res: Response) => res.statusCode < 400,
});

// Developer-friendly console logger
const consoleLogger = morgan("dev");

export { accessLogger, errorLogger, consoleLogger };

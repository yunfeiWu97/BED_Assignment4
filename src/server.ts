// src/server.ts
import app from "./app";
import { Server } from "http";

/**
 * Starts the Express HTTP server.
 */
const PORT: number | string = process.env.PORT || 3000;

const server: Server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default server;

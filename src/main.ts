import express from "express";
import cors from "cors";
import { FilesAPI } from "./routes/files";
import { PexelsAPI } from "./routes/pexels";

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 8080;

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost", "https://localhost", "capacitor://localhost"],
  }),
);

app.use(FilesAPI);
app.use(PexelsAPI);

const server = app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

// Optional: Handle errors and clean up resources
server.on("error", (error) => {
  console.error("Server error:", error);
});

process.on("SIGINT", () => {
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});

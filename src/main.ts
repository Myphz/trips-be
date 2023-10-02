import { fastify } from "./constants";
import { FilesAPI } from "./routes/files";
import cors from "@fastify/cors";

fastify.register(cors, {
  origin: ["http://localhost:5173", "http://localhost", "https://localhost", "capacitor://localhost"],
});
fastify.register(FilesAPI);

const main = async () => {
  try {
    await fastify.listen({
      host: "0.0.0.0",
      port: process.env.PORT ? parseInt(process.env.PORT) : 8080,
    });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
main();

import { fastify } from "./constants";
import { FilesAPI } from "./routes/files";

fastify.register(FilesAPI);

const main = async () => {
  try {
    await fastify.listen({
      port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
    });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
main();

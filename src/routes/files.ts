import { FastifyPluginCallback } from "fastify";
import multipart from "@fastify/multipart";
import { getFileDownload, getFileLink, uploadFiles } from "../telegram";
import { filesGeneratorToArray } from "../utils/array";

export const FilesAPI: FastifyPluginCallback = async (fastify, _, done) => {
  await fastify.register(multipart, {
    limits: {
      fieldNameSize: 1000,
      fileSize: 5e6, // 5 MB
      files: 50,
      fields: 0,
    },
  });

  fastify.post("/upload", async (req, res) => {
    console.log("Loading files...");
    const files = await filesGeneratorToArray(req.files());
    console.log(`Start upload of ${files.length} files...`);
    const ret = await uploadFiles(files);

    res.code(201);
    return ret;
  });

  fastify.get("/file", async (req, res) => {
    if (!req.query || typeof req.query !== "object" || !("id" in req.query)) return res.code(404).send();
    const { id } = req.query;
    if (typeof id !== "string") return res.code(401).send();

    const file = await getFileLink(id);
    if (!file) return res.code(404).send();

    return file;
  });

  fastify.get("/download", async (req, res) => {
    if (!req.query || typeof req.query !== "object" || !("id" in req.query)) return res.code(404).send();
    const { id } = req.query;
    if (typeof id !== "string") return res.code(401).send();

    const file = await getFileDownload(id);
    if (!file) return res.code(404).send();

    return file;
  });

  done();
};

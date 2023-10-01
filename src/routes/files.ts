import { FastifyPluginCallback } from "fastify";
import multipart from "@fastify/multipart";
import { getFile, uploadFile } from "../telegram";

export const FilesAPI: FastifyPluginCallback = async (fastify, _, done) => {
  await fastify.register(multipart, {
    limits: {
      fieldNameSize: 1000,
      fileSize: 1e9,
      files: 500,
      fields: 0,
    },
  });

  fastify.post("/upload", async (req, res) => {
    const files = req.files();
    const ids: Record<string, string> = {};

    for await (const file of files) {
      const id = await uploadFile(await file.toBuffer(), file.mimetype);
      ids[file.fieldname] = id;
    }

    res.code(201);
    return ids;
  });

  fastify.get("/file", async (req, res) => {
    if (!req.query || typeof req.query !== "object" || !("id" in req.query)) return res.code(404).send();
    const { id } = req.query;
    if (typeof id !== "string") return res.code(401).send();

    const file = await getFile(id);
    if (!file) return res.code(404).send();

    return file;
  });

  done();
};

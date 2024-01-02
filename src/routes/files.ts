import { FastifyPluginCallback } from "fastify";
import multipart from "@fastify/multipart";
import { getFileDownload, getFileLink, uploadFiles } from "../telegram";
import { readFile } from "fs/promises";

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
    // saveRequestFiles saves files in tmp directory.
    // This is to avoid working with req.files(), which is an async iterator... and a pain to work with.
    // Files from saveRequestFiles() have a useless toBuffer method, so it needs to be replaced.
    const files = (await req.saveRequestFiles()).map((file) => ({ ...file, toBuffer: () => readFile(file.filepath) }));
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

import express, { Request, Response } from "express";
import multer from "multer";
import { getFileDownload, getFileLink, uploadFiles } from "../telegram";

export const FilesAPI = express.Router();
const upload = multer({
  limits: {
    fieldNameSize: 1000,
    fileSize: 5e6, // 5 MB
    files: 50,
  },
  storage: multer.memoryStorage(),
});

FilesAPI.post("/upload", upload.any(), async (req: Request, res: Response) => {
  console.log("Loading files...");
  const files = req.files as Express.Multer.File[];
  console.log(`Start upload of ${files.length} files...`);
  const ret = await uploadFiles(files);

  res.status(201).json(ret);
});

FilesAPI.get("/file", async (req: Request, res: Response) => {
  if (!req.query || typeof req.query !== "object" || !("id" in req.query)) {
    return res.status(404).send();
  }

  const { id } = req.query;

  if (typeof id !== "string") {
    return res.status(401).send();
  }

  const file = await getFileLink(id);
  if (!file) {
    return res.status(404).send();
  }

  res.send(file);
});

FilesAPI.get("/download", async (req: Request, res: Response) => {
  if (!req.query || typeof req.query !== "object" || !("id" in req.query)) {
    return res.status(404).send();
  }

  const { id } = req.query;

  if (typeof id !== "string") {
    return res.status(401).send();
  }

  const file = await getFileDownload(id);
  if (!file) {
    return res.status(404).send();
  }

  res.json(file);
});

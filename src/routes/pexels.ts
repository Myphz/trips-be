import express, { Request, Response } from "express";
import { PEXELS_API_KEY } from "../constants";

export const PexelsAPI = express.Router();

const RESULTS = 30;
const PEXELS_ENDPOINT = "https://api.pexels.com/v1/search";

PexelsAPI.get("/pexels", async (req: Request, res: Response) => {
  if (!req.query || typeof req.query !== "object" || !("query" in req.query)) {
    return res.status(404).send();
  }

  const { query } = req.query;

  if (typeof query !== "string") {
    return res.status(401).send();
  }

  const params = new URLSearchParams({
    query,
    per_page: RESULTS.toString(),
  });

  try {
    const response = await fetch(`${PEXELS_ENDPOINT}?${params}`, {
      headers: {
        Authorization: PEXELS_API_KEY,
      },
    });

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error(`[ERR]: ${err}`);
    res.status(500).json({ error: true });
  }
});

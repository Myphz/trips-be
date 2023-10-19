import { FastifyPluginCallback } from "fastify";
import { PEXELS_API_KEY } from "../constants";

const RESULTS = "30";
const PEXELS_ENDPOINT = "https://api.pexels.com/v1/search";

export const PexelsAPI: FastifyPluginCallback = async (fastify, _, done) => {
  fastify.get("/pexels", async (req, res) => {
    if (!req.query || typeof req.query !== "object" || !("query" in req.query)) return res.code(404).send();
    const { query } = req.query;
    if (typeof query !== "string") return res.code(401).send();

    const params = new URLSearchParams({
      query,
      per_page: RESULTS,
    });

    try {
      const response = await fetch(`${PEXELS_ENDPOINT}?${params}`, {
        headers: {
          Authorization: PEXELS_API_KEY,
        },
      });

      return await response.json();
    } catch (err) {
      console.log(`[ERR]: ${err}`);
      return { error: true };
    }
  });

  done();
};

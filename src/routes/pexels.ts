import { FastifyPluginCallback } from "fastify";

const RESULTS = "30";
const PEXELS_ENDPOINT = "https://api.pexels.com/v1/search";
const ORIENTATION = "portrait";

export const PexelsAPI: FastifyPluginCallback = async (fastify, _, done) => {
  fastify.get("/pexels", async (req, res) => {
    if (!req.query || typeof req.query !== "object" || !("query" in req.query)) return res.code(404).send();
    const { query } = req.query;
    if (typeof query !== "string") return res.code(401).send();

    const params = new URLSearchParams({
      query,
      per_page: RESULTS,
      orientation: ORIENTATION,
    });

    try {
      const response = await fetch(`${PEXELS_ENDPOINT}?${params}`, {
        headers: {
          Authorization: `Bearer ${process.env.PEXELS_API_KEY}`,
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

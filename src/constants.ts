import dotenv from "dotenv";
import Fastify from "fastify";
import { throwError } from "./utils/throw";

dotenv.config();
dotenv.config({ path: ".env.production" });

export const fastify = Fastify({ logger: true });

export const TRIPS_BOT_API_TOKEN = process.env.TRIPS_BOT_API_TOKEN ?? throwError("Telegram API Token not set!");
export const CHAT_ID = process.env.CHAT_ID ?? throwError("CHAT_ID not set!");
export const PEXELS_API_KEY =
  process.env.PEXELS_API_KEY ?? process.env.PEXELS_API_KEY_DEBUG ?? throwError("PEXELS_API_KEY not set!");

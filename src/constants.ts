import "dotenv/config";
import Fastify from "fastify";
import { throwError } from "./utils/throw";

export const fastify = Fastify({ logger: true });

export const TRIPS_BOT_API_TOKEN = process.env.TRIPS_BOT_API_TOKEN ?? throwError("Telegram API Token not set!");
export const CHAT_ID = process.env.CHAT_ID ?? throwError("CHAT_ID not set!");

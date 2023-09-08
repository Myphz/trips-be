import TelegramBot from "node-telegram-bot-api";
import { CHAT_ID, TRIPS_BOT_API_TOKEN } from "../constants";
import { throwError } from "../utils/throw";

const bot = new TelegramBot(TRIPS_BOT_API_TOKEN, { filepath: false });

export async function uploadFile(buffer: Buffer) {
  const msg = await bot.sendDocument(CHAT_ID, buffer);
  return msg.document?.file_id ?? throwError("Couldn't upload file!");
}

export async function getFile(fileId: string) {
  const link = await bot.getFileLink(fileId);

  const imageData = await fetch(link);
  const stringBuffer = Buffer.from(await imageData.arrayBuffer()).toString("base64");

  const contentType = imageData.headers.get("content-type");
  return `data:${contentType};base64,${stringBuffer}`;
}

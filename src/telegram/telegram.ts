import TelegramBot from "node-telegram-bot-api";
import { CHAT_ID, TRIPS_BOT_API_TOKEN } from "../constants";
import { throwError } from "../utils/throw";

// Disable warning
process.env["NTBA_FIX_350"] = "1";

const bot = new TelegramBot(TRIPS_BOT_API_TOKEN, { filepath: false });

export async function uploadFile(buffer: Buffer, contentType: string) {
  const msg = await bot.sendDocument(CHAT_ID, buffer, {}, { filename: `${+new Date()}`, contentType });
  return msg.document?.file_id ?? throwError("Couldn't upload file!");
}

export async function getFile(fileId: string) {
  let link: string;
  try {
    link = await bot.getFileLink(fileId);
  } catch (err) {
    return;
  }

  const imageData = await fetch(link);
  return Buffer.from(await imageData.arrayBuffer());
}

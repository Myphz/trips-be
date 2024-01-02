import TelegramBot, { InputMediaPhoto } from "node-telegram-bot-api";
import { CHAT_ID, TRIPS_BOT_API_TOKEN } from "../constants";
import { throwError } from "../utils/throw";
import { MultipartFile } from "@fastify/multipart";

// Disable warning
process.env["NTBA_FIX_350"] = "1";

const bot = new TelegramBot(TRIPS_BOT_API_TOKEN, { filepath: false });

export async function uploadFiles(files: MultipartFile[]) {
  // This library has incorrect typescript typings... InputMediaDocument missing
  console.log("Reading files from disk...");
  const media = (await Promise.all(
    files.map(async (file) => ({ media: await file.toBuffer(), type: "document" })),
  )) as unknown as InputMediaPhoto[];

  console.log("Uploading to Telegram...");
  return (await bot.sendMediaGroup(CHAT_ID, media)).reduce(
    (prev, curr, i) => ({
      ...prev,
      [files[i].fieldname]: curr.document?.file_id ?? throwError("Couldn't upload file!"),
    }),
    {},
  );
}

export async function getFileLink(fileId: string) {
  return await bot.getFileLink(fileId);
}

export async function getFileDownload(fileId: string) {
  let link: string;
  try {
    link = await bot.getFileLink(fileId);
  } catch (err) {
    return;
  }

  const imageData = await fetch(link);
  return Buffer.from(await imageData.arrayBuffer());
}

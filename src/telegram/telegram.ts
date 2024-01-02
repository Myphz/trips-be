import TelegramBot, { InputMediaPhoto } from "node-telegram-bot-api";
import {
  CHAT_ID,
  TELEGRAM_MAX_PHOTOS_PER_MESSAGE,
  TELEGRAM_MAX_PHOTOS_PER_SECOND,
  TRIPS_BOT_API_TOKEN,
} from "../constants";
import { throwError } from "../utils/throw";
import { MultipartFile } from "@fastify/multipart";
import { splitArrayIntoChunks } from "../utils/array";

// Disable warning
process.env["NTBA_FIX_350"] = "1";

const bot = new TelegramBot(TRIPS_BOT_API_TOKEN, { filepath: false });

async function uploadFileGroup(files: MultipartFile[], media: InputMediaPhoto[]) {
  return (await bot.sendMediaGroup(CHAT_ID, media)).reduce(
    (prev, curr, i) => ({
      ...prev,
      [files[i].fieldname]: curr.document?.file_id ?? throwError("Couldn't upload file!"),
    }),
    {} as Record<string, string>,
  );
}

export async function uploadFiles(files: MultipartFile[]) {
  let ret: Record<string, string> = {};
  console.log("Reading files from disk...");
  // This library has incorrect typescript typings... InputMediaDocument missing
  const media = (await Promise.all(
    files.map(async (file) => ({ media: await file.toBuffer(), type: "document" })),
  )) as unknown as InputMediaPhoto[];
  const fileChunks = splitArrayIntoChunks(files, TELEGRAM_MAX_PHOTOS_PER_MESSAGE);
  const mediaChunks = splitArrayIntoChunks(media, TELEGRAM_MAX_PHOTOS_PER_MESSAGE);

  console.log("Uploading to Telegram...");

  for (let i = 0; i < mediaChunks.length; i++) {
    console.log(`Uploading chunk #${i + 1}...`);
    const uploadedChunk = await uploadFileGroup(fileChunks[i], mediaChunks[i]);
    // Merge results
    ret = { ...ret, ...uploadedChunk };
    // Wait 1s after uploading TELEGRAM_MAX_PHOTOS_PER_SECOND photos
    if (i && ((i + 1) * TELEGRAM_MAX_PHOTOS_PER_MESSAGE) % TELEGRAM_MAX_PHOTOS_PER_SECOND === 0)
      await new Promise((res) => setTimeout(res, 1000));
  }

  return ret;
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

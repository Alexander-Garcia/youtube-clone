// 1. GCS file interactions
// 2. Local file interactions
import { Storage } from "@google-cloud/storage";
import fs from "fs";
import ffmpeg from "fluent-ffmpeg";

const storage = new Storage();
const rawVideoBucketName = "ag-yt-raw-videos";
const processedVideoBucketName = "ag-yt-processed-videos";
const localRawVideoPath = "./raw-videos";
const localProcessedVideoPath = "./processed-videos";

/**
 * Creates local directories for storing raw and processed videos if they don't exist
 */
export function setupDirectories() {
  ensureDirectoryExistence(localRawVideoPath);
  ensureDirectoryExistence(localProcessedVideoPath);
}

/**
 * @param rawVideoName - The name of the raw video file to be processed {@link localRawVideoPath}
 * @param processedVideoName - The name of the processed video file {@link localProcessedVideoPath}
 * @returns A promise that resolves when the video conversion is complete
 */
export function convertVideo(rawVideoName: string, processedVideoName: string) {
  // process the video
  return new Promise<void>((resolve, reject) => {
    ffmpeg(`${localRawVideoPath}/${rawVideoName}`)
      .outputOptions("-vf", "scale=1080:1920") // scale 1080x1920
      .on("end", () => {
        console.log(`Processing of ${rawVideoName} finished successfully`);
        resolve();
      })
      .on("error", (err) => {
        console.log(`An error occurred: ${err.message}`);
        reject(err);
      })
      .save(`${localProcessedVideoPath}/${processedVideoName}`);
  });
}

/**
 * @param fileName - The name of the file to download from the
 * {@link rawVideoBucketName} bucket into the {@link localRawVideoPath} directory
 * @returns A promise that resolves when the file is downloaded
 */
export async function downloadRawVideo(fileName: string) {
  await storage
    .bucket(rawVideoBucketName)
    .file(fileName)
    .download({
      destination: `${localRawVideoPath}/${fileName}`,
    });

  console.log(
    `gs://${rawVideoBucketName}/${fileName} downloaded to ${localRawVideoPath}/${fileName}`
  );
}

/**
 * @param fileName - The name of the file to upload to the {@link processedVideoBucketName} bucket
 * @returns A promise that resolves when the file is uploaded
 */
export async function uploadProcessedVideo(fileName: string) {
  const bucket = storage.bucket(processedVideoBucketName);

  await storage
    .bucket(processedVideoBucketName)
    .upload(`${localProcessedVideoPath}/${fileName}`, {
      destination: fileName,
    });
  console.log(
    `gs://${processedVideoBucketName}/${fileName} uploaded to ${localProcessedVideoPath}/${fileName}`
  );

  // set video to be publicly readable
  await bucket.file(fileName).makePublic();
}

/**
 * @param fileName - Name of the file to delete from the {@link localRawVideoPath} directory
 */
export function deleteRawVideo(fileName: string) {
  return deleteFile(`${localRawVideoPath}/${fileName}`);
}

/**
 * @param fileName - Name of the file to delete from the {@link localProcessedVideoPath} directory
 */
export function deleteProcessedVideo(fileName: string) {
  return deleteFile(`${localProcessedVideoPath}/${fileName}`);
}

/**
 * @param filePath - The path to the file to be deleted
 * @returns A promise that resolves when the file is deleted
 */
function deleteFile(filePath: string): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    if (fs.existsSync(filePath)) {
      fs.unlink(filePath, (err) => {
        if (err) {
          console.log(`Failed to delete file at ${filePath}`, err);
          reject(err);
        } else {
          console.log(`File deleted at ${filePath}`);
          resolve();
        }
      });
    } else {
      console.log(`File not found at ${filePath}, so not deleted`);
      reject();
    }
  });
}

/**
 * Ensures a directory exists
 * @param dirPath - The path to the directory
 */
function ensureDirectoryExistence(dirPath: string) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true }); // recursive: true allows for nested directories
    console.log(`Directory created at ${dirPath}`);
  }
}

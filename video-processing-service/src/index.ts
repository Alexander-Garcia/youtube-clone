import express, { Request, Response } from "express";
import {
  convertVideo,
  downloadRawVideo,
  setupDirectories,
  uploadProcessedVideo,
  deleteRawVideo,
  deleteProcessedVideo,
} from "./storage";

// create local dirs for videos
setupDirectories();

const app = express();
app.use(express.json());

// Process video from cloud storage
app.post(
  "/process-video",
  async (req: Request, res: Response): Promise<any> => {
    // get bucket and filename from the Cloud pub/sub message
    let data;
    try {
      const message = Buffer.from(req.body.message.data, "base64").toString(
        "utf-8"
      );
      data = JSON.parse(message);
      if (!data.name) {
        throw new Error("Invalid message payload received.");
      }
    } catch (error) {
      console.error(error);
      return res.status(400).send("Bad Request: missing filename.");
    }

    const inputFileName = data.name;
    const outputFileName = `processed-${inputFileName}`;

    // download the raw video from Cloud Storage
    await downloadRawVideo(inputFileName);

    // Convert video
    try {
      await convertVideo(inputFileName, outputFileName);
    } catch (error) {
      await Promise.all([
        deleteRawVideo(inputFileName),
        deleteProcessedVideo(outputFileName),
      ]);
      return res.status(500).send("Failed to process video");
    }

    // upload the processed video to cloud storage
    await uploadProcessedVideo(outputFileName);

    await Promise.all([
      deleteRawVideo(inputFileName),
      deleteProcessedVideo(outputFileName),
    ]);

    return res.status(200).send("Processing finished successfully");
  }
);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

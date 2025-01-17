"use client";

import { uploadVideo } from "../firebase/functions";
import styles from "./upload.module.css";
import Image from "next/image";

export default function Upload() {
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event?.target?.files?.item(0);
    if (file) {
      try {
        await uploadVideo(file);
        alert("Upload successful");
      } catch (error) {
        alert(`Failed to upload: ${error}`);
      }
    }
  };

  return (
    <>
      <input
        id="upload"
        className={styles.uploadInput}
        type="file"
        accept="video/*"
        onChange={handleFileChange}
      />
      <label htmlFor="upload" className={styles.uploadButton}>
        <Image src="/upload.svg" alt="Upload" width={80} height={10} />
      </label>
    </>
  );
}

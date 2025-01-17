import { getFunctions, httpsCallable } from "firebase/functions";

const functions = getFunctions();

const generateUploadUrl = httpsCallable(functions, "generateUploadUrl");

export async function uploadVideo(file: File) {
  // https://firebase.google.com/docs/functions/callable?gen=2nd#web_7
  const response: any = await generateUploadUrl({
    fileExtension: file.name.split(".").pop(),
  });

  // upload file via signed URL
  await fetch(response?.data?.url, {
    method: "PUT",
    body: file,
    headers: {
      "Content-Type": file.type,
    },
  });
}

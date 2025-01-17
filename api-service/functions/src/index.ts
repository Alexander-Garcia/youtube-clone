import { initializeApp } from 'firebase-admin/app';
import { Firestore } from 'firebase-admin/firestore';
import { beforeUserCreated } from 'firebase-functions/v2/identity';
import * as logger from 'firebase-functions/logger';
import * as functions from 'firebase-functions';
import { Storage } from '@google-cloud/storage';
import { onCall } from 'firebase-functions/v2/https';

initializeApp();

const firestore = new Firestore();
const storage = new Storage();
const rawVideoBucketName = 'ag-yt-raw-videos';

/**
 * Create a user in the database when a user is created in Firebase Auth.
 * @param user - The user object created in Firebase Auth.
 * @returns void
 */
export const createUser = beforeUserCreated(({ data: user }) => {
  const userInfo = {
    uid: user?.uid || '',
    email: user?.email || '',
    photoURL: user?.photoURL || '',
  };

  firestore.collection('users').doc(userInfo.uid).set(userInfo);
  logger.info('Creating user', JSON.stringify(userInfo));
  return;
});

export const generateUploadUrl = onCall(
  { maxInstances: 1 },
  async (request) => {
    // Check if user is auth
    if (!request.auth) {
      // https://firebase.google.com/docs/reference/node/firebase.functions
      // for FunctionsErrorCode strings
      throw new functions.https.HttpsError(
        'failed-precondition',
        'Function must be called while authenticated',
      );
    }

    const auth = request.auth;
    const data = request.data;
    const bucket = storage.bucket(rawVideoBucketName);

    // generate unique filename
    const fileName = `${auth.uid}-${Date.now()}.${data.fileExtension}`;

    const [url] = await bucket.file(fileName).getSignedUrl({
      version: 'v4',
      action: 'write',
      expires: Date.now() + 15 * 60 * 1000, // 15 minutes
    });
    return { url, fileName };
  },
);

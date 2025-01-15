import { initializeApp } from "firebase-admin/app";
import { Firestore } from "firebase-admin/firestore";
import { beforeUserCreated } from "firebase-functions/v2/identity";
import * as logger from "firebase-functions/logger";

initializeApp();

const firestore = new Firestore();

/**
 * Create a user in the database when a user is created in Firebase Auth.
 * @param user - The user object created in Firebase Auth.
 * @returns void
 */
export const createUser = beforeUserCreated(({ data: user }) => {
  const userInfo = {
    uid: user?.uid || "",
    email: user?.email || "",
    photoURL: user?.photoURL || "",
  };

  firestore.collection("users").doc(userInfo.uid).set(userInfo);
  logger.info("Creating user", JSON.stringify(userInfo));
  return;
});

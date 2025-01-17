"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateUploadUrl = exports.createUser = void 0;
const app_1 = require("firebase-admin/app");
const firestore_1 = require("firebase-admin/firestore");
const identity_1 = require("firebase-functions/v2/identity");
const logger = __importStar(require("firebase-functions/logger"));
const functions = __importStar(require("firebase-functions"));
const storage_1 = require("@google-cloud/storage");
const https_1 = require("firebase-functions/v2/https");
(0, app_1.initializeApp)();
const firestore = new firestore_1.Firestore();
const storage = new storage_1.Storage();
const rawVideoBucketName = 'ag-yt-raw-videos';
/**
 * Create a user in the database when a user is created in Firebase Auth.
 * @param user - The user object created in Firebase Auth.
 * @returns void
 */
exports.createUser = (0, identity_1.beforeUserCreated)(({ data: user }) => {
    const userInfo = {
        uid: (user === null || user === void 0 ? void 0 : user.uid) || '',
        email: (user === null || user === void 0 ? void 0 : user.email) || '',
        photoURL: (user === null || user === void 0 ? void 0 : user.photoURL) || '',
    };
    firestore.collection('users').doc(userInfo.uid).set(userInfo);
    logger.info('Creating user', JSON.stringify(userInfo));
    return;
});
exports.generateUploadUrl = (0, https_1.onCall)({ maxInstances: 1 }, async (request) => {
    // Check if user is auth
    if (!request.auth) {
        // https://firebase.google.com/docs/reference/node/firebase.functions
        // for FunctionsErrorCode strings
        throw new functions.https.HttpsError('failed-precondition', 'Function must be called while authenticated');
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
});
//# sourceMappingURL=index.js.map
import { initializeApp, applicationDefault, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";
import { getAuth } from "firebase-admin/auth";
import config from "../configuration/config.js";

initializeApp({
  credential: cert(config.serviceAcc),
  storageBucket: config.firebaseConfig.storageBucket,
});

const db = getFirestore();
const bucket = getStorage().bucket();
const auth = getAuth();

export default { db, bucket, auth };

import admin from "firebase-admin";
import { env } from "./env";

let serviceAccount: admin.ServiceAccount;

try {
  serviceAccount = JSON.parse(env.SERVICE_ACCOUNT);
} catch {
  console.error("SERVICE_ACCOUNT env var is not valid JSON.");
  process.exit(1);
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export default admin;

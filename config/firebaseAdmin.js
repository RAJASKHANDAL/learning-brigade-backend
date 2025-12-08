const admin = require("firebase-admin");

let serviceAccount;

if (process.env.SERVICE_ACCOUNT) {
  // Render / production
  serviceAccount = JSON.parse(process.env.SERVICE_ACCOUNT);
} else {
  // Local dev only – keep this file out of git
  // path relative to THIS file
  serviceAccount = require("./serviceAccountKey.json");
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

module.exports = admin;

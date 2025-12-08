require("dotenv").config();
const admin = require("firebase-admin");

let serviceAccount ;

//If SERVICE_ACCOUNT exists → running on Render / production
if (process.env.SERVICE_ACCOUNT) {
  serviceAccount = JSON.parse(process.env.SERVICE_ACCOUNT);
}

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;

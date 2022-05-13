var admin = require("firebase-admin");
var serviceAccount = require("./../../serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://mwstore-notification-default-rtdb.firebaseio.com",
});
export const messaging = admin.messaging();

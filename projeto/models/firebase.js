const admin = require("firebase-admin");

const serviceAccount = require("../agendamentos-36238-firebase-adminsdk-fbsvc-ccdbef5137.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://agendamentos-36238.firebaseio.com"
});

const db = admin.firestore();

module.exports = db;

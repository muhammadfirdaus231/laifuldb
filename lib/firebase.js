import admin from "firebase-admin";
import bcrypt from "bcryptjs";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    }),
  });
}

const db = admin.firestore();

export async function seedDevs() {
  const snap = await db.collection("users")
    .where("username", "==", process.env.DEVS_USERNAME)
    .get();

  if (snap.empty) {
    const hash = await bcrypt.hash(process.env.DEVS_PASSWORD, 10);

    await db.collection("users").add({
      username: process.env.DEVS_USERNAME,
      password: hash,
      role: "developers",
      createdAt: new Date()
    });

    console.log("Devs auto created");
  }
}

export { db };

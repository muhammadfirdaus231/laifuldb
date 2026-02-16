import admin from "firebase-admin"
import bcrypt from "bcryptjs"

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    }),
  })
}

const db = admin.firestore()

// AUTO SEED OWNER (only once)
const seedOwner = async () => {
  const username = process.env.INITIAL_OWNER_USERNAME
  const password = process.env.INITIAL_OWNER_PASSWORD

  if (!username || !password) return

  const existing = await db
    .collection("users")
    .where("username", "==", username)
    .get()

  if (!existing.empty) return // sudah ada → tidak dobel

  const hash = await bcrypt.hash(password, 10)

  await db.collection("users").add({
    username,
    password: hash,
    role: "owners",
    createdAt: new Date()
  })

  console.log("Initial owner created")
}

// Jalankan sekali saat server start
seedOwner()

export { db }

let cached = global._firebaseAdmin

if (!cached) {
  cached = global._firebaseAdmin = { db: null }
}

export async function getDb() {
  if (cached.db) return cached.db

  const admin = require("firebase-admin")
  const bcrypt = require("bcryptjs")

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
  cached.db = db

  // ===== AUTO SEED OWNER SAFE =====
  const username = process.env.INITIAL_OWNER_USERNAME
  const password = process.env.INITIAL_OWNER_PASSWORD

  if (username && password) {
    const snap = await db
      .collection("users")
      .where("username", "==", username)
      .limit(1)
      .get()

    if (snap.empty) {
      const hash = await bcrypt.hash(password, 10)

      await db.collection("users").add({
        username,
        password: hash,
        role: "owners",
        createdAt: new Date(),
      })

      console.log("Initial owner created")
    }
  }

  return db
}

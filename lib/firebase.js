let dbInstance = null

export async function getDb() {
  if (dbInstance) return dbInstance

  const admin = await import("firebase-admin")
  const bcrypt = await import("bcryptjs")

  if (!admin.default.apps.length) {
    admin.default.initializeApp({
      credential: admin.default.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      }),
    })
  }

  const db = admin.default.firestore()
  dbInstance = db

  // ===== AUTO SEED OWNER (SAFE + NO DOUBLE) =====
  const username = process.env.INITIAL_OWNER_USERNAME
  const password = process.env.INITIAL_OWNER_PASSWORD

  if (username && password) {
    const existing = await db
      .collection("users")
      .where("username", "==", username)
      .limit(1)
      .get()

    if (existing.empty) {
      const hash = await bcrypt.default.hash(password, 10)

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

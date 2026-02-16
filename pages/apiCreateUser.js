export const config = { runtime: "nodejs" }

import bcrypt from "bcryptjs"

export default async function handler(req, res) {
  const admin = require("firebase-admin")

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

  const { username, password, role } = req.body

  const existing = await db
    .collection("users")
    .where("username", "==", username)
    .limit(1)
    .get()

  if (!existing.empty) {
    return res.status(400).json({ error: "Username exists" })
  }

  const hash = await bcrypt.hash(password, 10)

  await db.collection("users").add({
    username,
    password: hash,
    role,
    createdAt: new Date(),
  })

  res.json({ success: true })
}

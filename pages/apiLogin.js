export const config = { runtime: "nodejs" }

import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import cookie from "cookie"

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

  const { username, password } = req.body

  const snap = await db
    .collection("users")
    .where("username", "==", username)
    .limit(1)
    .get()

  if (snap.empty) return res.status(400).json({ error: "User not found" })

  const user = snap.docs[0].data()
  const valid = await bcrypt.compare(password, user.password)

  if (!valid) return res.status(400).json({ error: "Wrong password" })

  const token = jwt.sign(
    { username: user.username, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  )

  res.setHeader(
    "Set-Cookie",
    cookie.serialize("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "strict",
    })
  )

  res.json({ role: user.role })
}

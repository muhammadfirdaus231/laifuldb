export const config = {
  runtime: "nodejs",
}

import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import cookie from "cookie"
import { getDb } from "../lib/firebase"

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  const db = await getDb()
  const { username, password } = req.body

  if (!username || !password) {
    return res.status(400).json({ error: "Missing credentials" })
  }

  const snap = await db
    .collection("users")
    .where("username", "==", username)
    .limit(1)
    .get()

  if (snap.empty) {
    return res.status(400).json({ error: "User not found" })
  }

  const user = snap.docs[0].data()
  const valid = await bcrypt.compare(password, user.password)

  if (!valid) {
    return res.status(400).json({ error: "Wrong password" })
  }

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

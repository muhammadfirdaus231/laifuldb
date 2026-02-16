export const config = {
  runtime: "nodejs",
}

import bcrypt from "bcryptjs"
import { getDb } from "../lib/firebase"

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  const db = await getDb()
  const { username, password, role } = req.body

  if (!username || !password || !role) {
    return res.status(400).json({ error: "Missing fields" })
  }

  const existing = await db
    .collection("users")
    .where("username", "==", username)
    .limit(1)
    .get()

  if (!existing.empty) {
    return res.status(400).json({ error: "Username already exists" })
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

import { db } from "../lib/firebase"
import bcrypt from "bcryptjs"

export default async function handler(req, res) {
  const { username, password, role } = req.body

  const hash = await bcrypt.hash(password, 10)

  await db.collection("users").add({
    username,
    password: hash,
    role
  })

  res.json({ success: true })
}

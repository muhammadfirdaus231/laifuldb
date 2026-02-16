import { db } from "../lib/firebase"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import cookie from "cookie"

export default async function handler(req, res) {
  const { username, password } = req.body

  const snap = await db.collection("users")
    .where("username", "==", username)
    .get()

  if (snap.empty) return res.json({ error: "User not found" })

  const user = snap.docs[0].data()
  const valid = await bcrypt.compare(password, user.password)

  if (!valid) return res.json({ error: "Wrong password" })

  const token = jwt.sign(
    { username: user.username, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  )

  res.setHeader("Set-Cookie",
    cookie.serialize("token", token, {
      httpOnly: true,
      secure: true,
      path: "/",
      sameSite: "strict"
    })
  )

  res.json({ role: user.role })
}

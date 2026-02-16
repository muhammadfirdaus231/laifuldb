export const config = {
  runtime: "nodejs",
}

import { getDb } from "../lib/firebase"

export default async function handler(req, res) {
  const db = await getDb()

  const snap = await db.collection("users").get()

  const users = snap.docs.map(doc => {
    const data = doc.data()
    return {
      id: doc.id,
      username: data.username,
      role: data.role,
      createdAt: data.createdAt || null,
    }
  })

  res.json(users)
}

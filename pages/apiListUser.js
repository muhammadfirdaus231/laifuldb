import { db } from "../lib/firebase"

export default async function handler(req, res) {
  const snap = await db.collection("users").get()
  const users = snap.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    password: undefined
  }))
  res.json(users)
}

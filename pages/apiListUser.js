export const config = { runtime: "nodejs" }

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

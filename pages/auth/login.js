import { useState } from "react"
import { useRouter } from "next/router"

export default function Login() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()

  const handleLogin = async () => {
    const res = await fetch("/apiLogin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    })

    const data = await res.json()
    if (data.role === "owners") router.push("/dasboradmins")
    if (data.role === "members") router.push("/dasborUser")
    if (!data.role) alert("Login gagal")
  }

  return (
    <div className="container">
      <div className="card">
        <h1>Login Panel</h1>
        <input
          placeholder="Username"
          onChange={e => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          onChange={e => setPassword(e.target.value)}
        />
        <button onClick={handleLogin}>Login</button>
      </div>
    </div>
  )
}

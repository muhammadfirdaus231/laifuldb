import { useState, useEffect } from "react"

export default function DasborAdmins() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("members")
  const [users, setUsers] = useState([])

  const createUser = async () => {
    await fetch("/apiCreateUser", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password, role })
    })
    loadUsers()
  }

  const loadUsers = async () => {
    const res = await fetch("/apiListUser")
    const data = await res.json()
    setUsers(data)
  }

  useEffect(() => { loadUsers() }, [])

  return (
    <div className="container">
      <div className="card">
        <h1>Dasbor Admin</h1>

        <h3>Create User</h3>
        <input placeholder="Username" onChange={e=>setUsername(e.target.value)} />
        <input type="password" placeholder="Password" onChange={e=>setPassword(e.target.value)} />
        <select onChange={e=>setRole(e.target.value)}>
          <option value="members">members</option>
          <option value="owners">owners</option>
        </select>
        <button onClick={createUser}>Create</button>

        <h3>List Akun</h3>
        {users.map(u => (
          <div key={u.id}>
            {u.username} - {u.role}
          </div>
        ))}
      </div>
    </div>
  )
}

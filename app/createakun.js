"use client";
import { useState,useEffect } from "react";

export default function CreateAkun(){
  const [roles,setRoles]=useState([]);
  const [username,setUsername]=useState("");
  const [password,setPassword]=useState("");
  const [role,setRole]=useState("");

  useEffect(()=>{
    fetch("/api/myrole")
    .then(r=>r.json())
    .then(data=>{
      if(data.role==="developers")
        setRoles(["members","resellers","owners","developers"]);
      if(data.role==="owners")
        setRoles(["members","resellers"]);
      if(data.role==="resellers")
        setRoles(["members"]);
    });
  },[]);

  async function create(){
    await fetch("/api/createakun",{
      method:"POST",
      body:JSON.stringify({username,password,role})
    });
    alert("Berhasil dibuat");
  }

  return(
    <div style={{padding:40}}>
      <h1>Create Account</h1>
      <input placeholder="Username" onChange={e=>setUsername(e.target.value)} style={input}/>
      <input type="password" placeholder="Password" onChange={e=>setPassword(e.target.value)} style={input}/>
      <select onChange={e=>setRole(e.target.value)} style={input}>
        <option>Pilih Role</option>
        {roles.map(r=><option key={r}>{r}</option>)}
      </select>
      <button onClick={create} style={btn}>Create</button>
    </div>
  );
}

const input={width:"100%",padding:8,marginTop:10,borderRadius:5};
const btn={width:"100%",padding:10,marginTop:15};

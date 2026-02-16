"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login(){
  const [username,setUsername]=useState("");
  const [password,setPassword]=useState("");
  const router=useRouter();

  async function login(){
    const res=await fetch("/api/login",{
      method:"POST",
      body:JSON.stringify({username,password})
    });
    const data=await res.json();
    if(data.success) router.push(data.redirect);
    else alert("Login gagal");
  }

  return(
    <div style={{display:"flex",height:"100vh",justifyContent:"center",alignItems:"center"}}>
      <div style={{background:"rgba(255,255,255,0.1)",padding:30,borderRadius:10,width:300}}>
        <h2>Login</h2>
        <input placeholder="Username" onChange={e=>setUsername(e.target.value)} style={input}/>
        <input type="password" placeholder="Password" onChange={e=>setPassword(e.target.value)} style={input}/>
        <button onClick={login} style={btn}>Login</button>
      </div>
    </div>
  );
}

const input={width:"100%",padding:8,marginTop:10,borderRadius:5,border:"none"};
const btn={width:"100%",padding:10,marginTop:15,background:"#2563eb",color:"white",border:"none",borderRadius:5};

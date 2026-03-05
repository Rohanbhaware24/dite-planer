"use client";

import { useState } from "react";

export default function RegisterPage() {

  const [name,setName] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [confirmPassword,setConfirmPassword] = useState("");
  const [message,setMessage] = useState("");

  const handleSubmit = async (e:any) => {
    e.preventDefault();

    const res = await fetch("/api/auth/register",{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        name,
        email,
        password,
        confirmPassword
      })
    });

    const data = await res.json();

    if(res.ok){
      setMessage("Registration Successful ✅");
    }else{
      setMessage(data.error);
    }

    console.log(data);
  }

  return (
    <div style={{padding:"40px"}}>
      
      <h1>Register</h1>

      <form onSubmit={handleSubmit} style={{display:"flex",flexDirection:"column",width:"300px",gap:"10px"}}>

        <input
          type="text"
          placeholder="Enter Name"
          value={name}
          onChange={(e)=>setName(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e)=>setConfirmPassword(e.target.value)}
          required
        />

        <button type="submit">Register</button>

      </form>

      <p>{message}</p>

    </div>
  );
}
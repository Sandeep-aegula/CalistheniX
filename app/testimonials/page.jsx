
// import Image from "next/image";
// import { Button } from "@/components/ui/button";
// import HeroSection from "@/components/hero";
'use client'
// import axios from "axios"
import { useState } from "react";
export default function Home() {
  const [name,setName] =useState('');
  const [email,setEmail] =useState('')

  const handleSubmit= async(e)=>{
    e.preventDefault()
    try {
      const response = await axios.post('api/users',{name,email})
    } catch (error) {
      console.error(error)
      
    }
  }
  return (

    <>
      <div className="mt-40">
        
        {/* <HeroSection /> */}
        <h2>form</h2>
       <form action="F" align="center">
        <div>
          <label htmlFor="name">Name: </label>
          <input type="text" placeholder="Enter name" 
          onChange={(e)=>setName(e.target.value)}
          value={name}
          />
          </div>
          <div>
          <label htmlFor="email" >Email: </label>
          <input type="email"placeholder="Enter email" 
           onChange={(e)=>setEmail(e.target.value)}
           value={email}/>
          </div>
          <button style={{}}>submit</button>
       </form>

      </div>
    </>
  );
}
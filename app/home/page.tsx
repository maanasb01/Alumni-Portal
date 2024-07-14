import { auth, signOut } from '@/auth'
import React from 'react'


export default async function Home() {

    const session = await auth();
  return (
    <div>
      {JSON.stringify(session)}
      
      <form action={async()=>{
        "use server";
        await signOut();
      }}>

        <button type='submit' className='text-red-500 border border-red-500 px-2 py-1'>
          Logout
        </button>
      
      </form>
      </div>
  )
}
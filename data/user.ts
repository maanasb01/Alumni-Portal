"use server"

import { db } from "@/lib/db";


const userSelectProperties={
    id: true,
    name: true,
    email: true,
    phone: true,
    image: true,
    isRegistered: true,
    organizationId: true,
    organization: {select:{name:true,city:true,state:true,country:true}},
    degree: true,
    EmploymentHistory: true,
    FamilyMembers: true,
    createdAt: true,
    emailVerified:true,
  
  }
// to be used in Auth by authjs credentioals inside auth.config.ts
  export async function getUserByEmailForAuth(email:string){

    try {
       
        const user = await db.user.findUnique({where:{email}});
        return user;
        
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function getUserByEmail(email:string){

    try {
       
        const user = await db.user.findUnique({where:{email},select:{...userSelectProperties}});
        return user;
        
    } catch (error) {
        console.log(error);
        throw error;
    }
}
export async function getUserById(id:string){
    console.log

    try {

        const user = await db.user.findUnique({where:{id},select:userSelectProperties});
        return user;
        
    } catch (error) {
        console.log(error);
        throw error;
    }
}
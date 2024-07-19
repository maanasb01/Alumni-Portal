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
    degreeId: true,
    EmploymentHistory: true,
    FamilyMembers: true,
    createdAt: true,
    emailVerified:true,
  
  }

export async function getUserByEmail(email:string){

    try {
       
        const user = await db.user.findUnique({where:{email},select:{...userSelectProperties,password:true}});
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
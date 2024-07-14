"use server"

import { RegisterSchema } from "@/schemas/authSchema";
import { z } from "zod";
import bcrypt from "bcryptjs"
import { getUserByEmail } from "@/data/user";
import { db } from "@/lib/db";
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";

export async function register(values:z.infer<typeof RegisterSchema>){
   

try {
    const validatedFields = RegisterSchema.safeParse(values);

    if(!validatedFields.success){
        return {error:"Invalid Fields"};
    }

    const {email, password, name} = validatedFields.data;
    const hashedPassword = await bcrypt.hash(password,10);

    const existingUser = await getUserByEmail(email);

    if(existingUser){
        return {error:"Email Already Registed!"}
    }

    await db.user.create({
        data:{name,email,password:hashedPassword}
    });

    await signIn("credentials",{
        email,
        password,
        redirectTo:DEFAULT_LOGIN_REDIRECT,
    })

    return {success:"Registration Successful!"}
    
} catch (error) {
    if(error instanceof AuthError){


        // Github Issue Fix. Some issue with error.type, always converting the error to CallbackrouteError instead of CredentialsSignin error 
        switch ((error.cause?.err as any).code ) {
            case "credentials":
                return {error:"Invalid Credentials!"}
        
            default:
                return {error:"Something Went Wrong!"}
        }
    }
    throw error;
    
}
  

    
}
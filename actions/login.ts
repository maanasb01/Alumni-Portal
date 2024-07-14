"use server"

import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { LoginSchema } from "@/schemas/authSchema";
import { AuthError } from "next-auth";
import { z } from "zod";

export async function login(values:z.infer<typeof LoginSchema>){

   

  
    const validatedFields = LoginSchema.safeParse(values);

    if(!validatedFields.success){
        return {error:"Invalid Fields"};
    }

    const {email,password} = validatedFields.data;

    try {


        await signIn("credentials",{
            email,
            password,
            redirectTo:DEFAULT_LOGIN_REDIRECT
        })
        
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
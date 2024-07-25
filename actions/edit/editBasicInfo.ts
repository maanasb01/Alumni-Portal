"use server";

import { z } from "zod";

import { getUserByEmail } from "@/data/user";
import { db } from "@/lib/db";
import { BasicInfoSchema } from "@/schemas/basicInfoSchema";
import { auth } from "@/auth";
import { redirect } from "next/navigation";


export async function editBasicInfo(values: z.infer<typeof BasicInfoSchema>) {
  const session = await auth();
  const user = session?.user;

  if (!user) return { error: "Unauthorized!" };

  try {
    const validatedFields = BasicInfoSchema.safeParse(values);

    if (!validatedFields.success) {
      return { error: "Invalid Fields" };
    }

    const { email, name, degree, phone } = validatedFields.data;

    const existingUser = await getUserByEmail(email);
    // if an user exists and if that existing user is not our user, then newly entered email is already in use by another user.
    // and if existing user is this user (loggedin), then there is no issue (as it is possible that user wants to update fields other than email)
    if (existingUser && existingUser.id !== user.id) {
      return { error: "New Entered Email is Already Registered!" };
    }

    await db.user.update({
      where: { id: user.id },
      data: {
        email,
        name: capitalizeWords(name),
        degree: capitalizeWords(degree),
        phone,
      },
    });

    redirect(`/profile/${user.id}`);


  } catch (error) {
    throw error;
  }
}

// To capatalize the first letter of every word. ex- john doe to John Doe
function capitalizeWords(str:string|undefined|null) {
    if(!str) return undefined;

    return str
      .split(' ') 
      .map(word => 
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() 
      )
      .join(' '); 
  }
"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import {
  BaseJoinOrgSchema,
  CombinedJoinSchema,
  ExtendedJoinOrgSchema,
} from "@/schemas/orgSchema";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export async function createjoinOrganization(
  values: z.infer<typeof ExtendedJoinOrgSchema>
) {
  const session = await auth();

  const validatedFields = ExtendedJoinOrgSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid Fields" };
  }

  const { name, type, country, state, city } = validatedFields.data;

  try {
    if(session?.user.isRegistered){
      throw new Error("User already is registered to an organization!")
    }
    const results = await db.$transaction(async (prisma) => {
      const newOrg = await prisma.organization.create({
        data: {
          name,
          type: type.value,
          countryId: country.value,
          stateId: state.value,
          cityId: city.value,
        },
      });

      const updatedUser = await prisma.user.update({
        where: { id: session?.user?.id },
        data: {
          organizationId: newOrg.id,
          isRegistered:true,
        },
      });
      revalidatePath('/organization');
    });
  } catch (error) {
    throw error;
  }
}

export async function joinOrganization(
  values: z.infer<typeof BaseJoinOrgSchema>
) {
  const session = await auth();

  const validatedFields = BaseJoinOrgSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid Fields" };
  }

  const { organization } = validatedFields.data;

  try {
    if(session?.user.isRegistered){
      throw new Error("User already is registered to an organization!")
    }
    const updatedUser = await db.user.update({
      where: { id: session?.user?.id },
      data: {
        organizationId: organization.value,
        isRegistered:true,
      },
    });
    revalidatePath('/organization');
  } catch (error) {
    throw error;
  }
}

export async function leaveOrganization(){
  const session = await auth();

  try {
    if(!session?.user.isRegistered){
      throw new Error("User dont have any organization to leave!")
    }
    await db.user.update({
      where:{id:session?.user.id},
      data:{
        organizationId:null,
        isRegistered:false
      }
    });
    revalidatePath('/organization');
  } catch (error) {
    console.log(error)
  }
}

"use server"

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { FamilyMemberSchema } from "@/schemas/familyMembersSchema";
import { z } from "zod";

export async function updateFamilyMembers(newEntries: z.infer<typeof FamilyMemberSchema>[]) {
  const session = await auth();
  const user = session?.user;

  if (!user) return { error: "Unauthorized!" };
  const ArrayOfObjectsSchema = z.array(FamilyMemberSchema);

  const validatedFields = ArrayOfObjectsSchema.safeParse(newEntries);
  if (!validatedFields.success) {
    return { error: "Invalid Fields" };
  }

    try {
      // Start a transaction
      const result = await db.$transaction(async (prisma) => {
        // Delete existing employment history records
        await prisma.familyMember.deleteMany({
          where: {
            personId: user.id,
          },
        });
  
        // Insert new employment history records
        const createPromises = validatedFields.data.map(entry => {
            const {id, ...otherEntries} = entry;
          return prisma.familyMember.create({
            data: {
              ...otherEntries,
              personId: user.id,
            },
          });
        });
  
        await Promise.all(createPromises);
      });
  
      return {success:true};
    } catch (error) {
      console.error('Failed to update Family Members:', error);
      throw error;
    }
  }
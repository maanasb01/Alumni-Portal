"use server"

import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function updateEmploymentHistory(newEntries: Array<{ company: string; position: string; startDate: Date; endDate?: Date }>) {
  const session = await auth();
  const user = session?.user;

  if (!user) return { error: "Unauthorized!" };
    try {
      // Start a transaction
      const result = await db.$transaction(async (prisma) => {
        // Delete existing employment history records
        await prisma.employmentHistory.deleteMany({
          where: {
            personId: user.id,
          },
        });
  
        // Insert new employment history records
        const createPromises = newEntries.map(entry => {
          return prisma.employmentHistory.create({
            data: {
              ...entry,
              personId: user.id,
            },
          });
        });
  
        await Promise.all(createPromises);
      });
  
      return {success:true};
    } catch (error) {
      console.error('Failed to update employment history:', error);
      throw error;
    }
  }
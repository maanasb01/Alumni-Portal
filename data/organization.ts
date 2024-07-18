"use server";
import { db } from "@/lib/db";

export async function searchOrganizations(query: string) {
  const orgs = await db.organization.findMany({
    where: {
      name: {
        contains: query,
        mode: "insensitive",
      },
    },
    select:{
        id:true,
        name:true
    },
    take: 10, // Limit the results to 10 for performance
  });

  return orgs;
}

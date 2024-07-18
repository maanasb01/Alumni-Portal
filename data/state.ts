"use server";
import { db } from "@/lib/db";

export async function searchStates(query: string, countryId: number) {

  const states = await db.state.findMany({
    where: {
      countryId: {
        equals: countryId,
      },
      name: {
        contains: query,
        mode: "insensitive",
      },
    },
    orderBy: { name: "asc" },
    take: 10, // Limit the results to 10 for performance
  });

  return states;
}

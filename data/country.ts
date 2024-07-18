"use server";
import { db } from "@/lib/db";

export async function searchCountries(query: string) {
  const countries = await db.country.findMany({
    where: {
      name: {
        contains: query,
        mode: "insensitive",
      },
    },
    take: 10, // Limit the results to 10 for performance
  });

  return countries;
}

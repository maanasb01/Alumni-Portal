"use server";
import { db } from "@/lib/db";

export async function searchCities(
  query: string,
  countryId: number,
  stateId: number
) {
  const cities = await db.city.findMany({
    where: {
      countryId: {
        equals: countryId,
      },
      stateId: {
        equals: stateId,
      },
      name: {
        contains: query,
        mode: "insensitive",
      },
    },
    orderBy: { name: "asc" },
    take: 10, // Limit the results to 10 for performance
  });

  return cities;
}

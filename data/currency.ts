"use server";
import { db } from "@/lib/db";

export async function searchCurrency(query: string) {

  try{
    const currencies = await db.currency.findMany({
    where: {
      OR: [
        {
          name: {
            contains: query,
            mode: "insensitive",
          },
        },
        {
          currency: {
            contains: query,
            mode: "insensitive",
          },
        },
        {
          currencySymbol: {
            contains: query,
            mode: "insensitive",
          },
        },
      ],
    },
    orderBy: { name: "asc" },
    take: 10, 
  });

  return currencies;
}catch(error){
    console.log(error);
    throw error;
}
}

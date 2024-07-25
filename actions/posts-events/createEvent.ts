"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { EventSchema } from "@/schemas/eventSchema";
import { z } from "zod";

export async function createEvent(data: z.infer<typeof EventSchema>) {
  const session = await auth();
  const user = session?.user;

  if (!user) return { error: "Unauthorized!" };
  if (!user.organizationId)
    return { error: "Please Join an Organization first to create a event" };

  const validatedFields = EventSchema.safeParse(data);

  try {
    if (!validatedFields.success) {
      return { error: "Invalid Fields" };
    }

    const { title, description, currency, fee } = validatedFields.data;

    const newEvent = await db.event.create({
      data: {
        organizerId: user.id,
        title,
        description,
        organizationId: user.organizationId,
        currencyId: currency.value,
        fee,
      },
      include: {
        organizer: { select: { name: true, image: true } },
        organization: { select: { name: true } },
        currency: true,
      },
    });
    return { success: "Event Created", event: newEvent };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function updateEvent(data: z.infer<typeof EventSchema>,eventId:string) {
  const session = await auth();
  const user = session?.user;

  if (!user) return { error: "Unauthorized!" };
  if (!user.organizationId)
    return { error: "Please Join an Organization first to create a event" };

  const validatedFields = EventSchema.safeParse(data);

  try {
    if (!validatedFields.success) {
      return { error: "Invalid Fields" };
    }

    const { title, description, currency, fee } = validatedFields.data;

    const newEvent = await db.event.update({
        where:{
            id:eventId
        },
      data: {
        
        title,
        description,
        currencyId: currency.value,
        fee,
      },
      include: {
        organizer: { select: { name: true, image: true } },
        organization: { select: { name: true } },
        currency: true,
      },
    });
    return { success: "Event Created", event: newEvent };
  } catch (error) {
    console.log(error);
    throw error;
  }
}


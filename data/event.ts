"use server";

import { db } from "@/lib/db";
import { SessionUser } from "@/types/user";

export async function getOrganizationEvents(user: SessionUser, page: number) {
  try {
    if (!user.organizationId) {
      return { error: "Organization not found", events: [] };
    }

    const events = await db.event.findMany({
      where: {
        organizationId: user.organizationId,
      },
      include: {
        organizer: { select: { name: true, image: true } },
        organization: { select: { name: true } },
        currency: true,
      },
      orderBy: { createdAt: "desc" },

      take: 20,
      skip: 20 * page,
    });

    return { events };
  } catch (error) {
    console.log(error);
    throw error;
  }
}
export async function getUserEvents(user: SessionUser, page: number) {
  try {
    // if (!user.organizationId) {
    //   return { error: "Organization not found" };
    // }

    const events = await db.event.findMany({
      where: {
        organizerId: user.id,
       
      },
      include: {
        organizer: { select: { name: true, image: true } },
        organization: { select: { name: true } },
        currency: true,
      },
      orderBy: { createdAt: "desc" },
      take: 20,
      skip: 20 * page,
    });

    return {events};
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function deleteEvent(eventId: string) {
  try {
    await db.event.delete({
      where: {
        id: eventId,
      },
    });

    return { success: true };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

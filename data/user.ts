"use server";

import { signOut } from "@/auth";
import { db } from "@/lib/db";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";

const userSelectProperties = {
  id: true,
  name: true,
  email: true,
  phone: true,
  image: true,
  isRegistered: true,
  organizationId: true,
  organization: {
    select: { name: true, city: true, state: true, country: true },
  },
  degree: true,
  EmploymentHistory: true,
  FamilyMembers: true,
  createdAt: true,
  emailVerified: true,
};
// to be used in Auth by authjs credentioals inside auth.config.ts
export async function getUserByEmailForAuth(email: string) {
  try {
    const user = await db.user.findUnique({ where: { email } });
    return user;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getUserByEmail(email: string) {
  try {
    const user = await db.user.findUnique({
      where: { email },
      select: { ...userSelectProperties },
    });
    return user;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
export async function getUserById(id: string) {
  console.log;

  try {
    const user = await db.user.findUnique({
      where: { id },
      select: userSelectProperties,
    });
    return user;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function searchUsers(query: string, page: number) {
  try {
    const users = await db.user.findMany({
      where: {
        OR: [
          {
            name: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            email: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            organization: {
              name: {
                contains: query,
                mode: "insensitive",
              },
            },
          },
        ],
      },
      select: {
        id: true,
        name: true,
        organization: { select: { name: true, id: true } },
      },
      take: 10,
      skip: page * 10,
    });

    return users;
  } catch (error) {
    console.error("Failed to search users:", error);
    throw error;
  }
}

export async function deleteUser(userId:string) {
  try {
    await db.user.delete({
      where: {
        id: userId,
      },
    });
    console.log(`User with ID ${userId} has been deleted.`);
   
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  } finally {
    await db.$disconnect();
  }
}
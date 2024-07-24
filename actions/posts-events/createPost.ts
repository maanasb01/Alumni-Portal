"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { PostSchema } from "@/schemas/postSchema";
import { z } from "zod";

export async function createPost(data: z.infer<typeof PostSchema>) {
  const session = await auth();
  const user = session?.user;

  if (!user) return { error: "Unauthorized!" };
  if(!user.organizationId) return {error:"Please Join an Organization first to create a post"};

  const validatedFields = PostSchema.safeParse(data);

  try {
    if (!validatedFields.success) {
      return { error: "Invalid Fields" };
    }

    const newPost = await db.post.create({
        data:{
            authorId:user.id,
            type:validatedFields.data.type,
            description:validatedFields.data.description,
            organizationId:user.organizationId
        },
        include:{
          author:{select:{name:true,image:true}},
          organization:{select:{name:true}}
        },
    })
    return {success:"Post Created",post:newPost}
  } catch (error) {
    console.log(error);
    throw error
  }
}
export async function updatePost(data: z.infer<typeof PostSchema>,postId:string) {
  const session = await auth();
  const user = session?.user;

  if (!user) return { error: "Unauthorized!" };
  if(!user.organizationId) return {error:"Please Join an Organization first to create a post"};

  const validatedFields = PostSchema.safeParse(data);

  try {
    if (!validatedFields.success) {
      return { error: "Invalid Fields" };
    }

    const newPost = await db.post.update({
        where:{
            id:postId
        },
        data:{
         
            type:validatedFields.data.type,
            description:validatedFields.data.description,
    
        },
      include:{
        author:{select:{name:true,image:true}},
        organization:{select:{name:true}}
      },
    })
    return {success:"Post Updated",post:newPost}
  } catch (error) {
    console.log(error);
    throw error
  }
}

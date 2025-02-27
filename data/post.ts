"use server";

import { db } from "@/lib/db";
import { SessionUser } from "@/types/user";

export async function getOrganizationPosts(user: SessionUser,page:number) {
  try {
    if (!user.organizationId) {
      return { error: "Organization not found", posts: [] };
    }

    const posts = await db.post.findMany({
      where: {

        organizationId: user.organizationId,
      },
      include:{
        author:{select:{name:true,image:true}},
        organization:{select:{name:true}}
      },
      orderBy:{createdAt:'desc'},

      take:20,
      skip:20*page
      
    });

    return {posts};
  } catch (error) {
    console.log(error);
    throw error;
  }
}
export async function getUserPosts(user: SessionUser, page:number) {
  try {
    

    const posts = await db.post.findMany({
      where: {
        authorId: user.id,
      },
      include:{
        author:{select:{name:true,image:true}},
        organization:{select:{name:true}}
      },
      orderBy:{createdAt:'desc'},
      take:20,
      skip:20*page
      
    });

    return {posts};
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function deletePost(postId:string){

    try {

        await db.post.delete({
            where:{
                id:postId
            }
        });

        return {success:true};
        
    } catch (error) {
        console.log(error);
        throw error
    }
}

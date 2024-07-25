import { z } from "zod";

// model Post {
//     id          String   @id @default(cuid())
//     type        PostType @default(Regular)
//     author      User     @relation(fields: [authorId], references: [id])
//     authorId    String
//     description String
//   }
  


export const PostType = z.enum(["Regular" , "FinancialEmergency" , "Announcement"],{required_error:"Required"});
export const PostSchema = z.object({
    type: PostType.default("Regular"),
    description: z.string().min(1,{message:"Required"})
})
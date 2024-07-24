import { z } from "zod";

// model Post {
//     id          String   @id @default(cuid())
//     type        PostType @default(Regular)
//     author      User     @relation(fields: [authorId], references: [id])
//     authorId    String
//     description String
//   }
  
//   model Event {
//     id          String   @id @default(cuid())
//     type        PostType
//     organizer   User     @relation(fields: [organizerId], references: [id])
//     organizerId String
//     description String
//     fee         Float    @default(0)
//     currency    String
//   }

export const PostType = z.enum(["Regular" , "FinancialEmergency" , "Announcement"],{required_error:"Required"});
export const PostSchema = z.object({
    type: PostType.default("Regular"),
    description: z.string().min(1,{message:"Required"})
})
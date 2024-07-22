// model FamilyMember {
//     id          String  @id @default(cuid())
//     name        String
//     relation    String
//     description String?
//     personId    String
//     person      User    @relation(fields: [personId], references: [id])
//   }

import { z } from "zod";

  
export const FamilyMemberSchema = z.object({
    id:z.string().optional(),
    name: z.string().min(1,{message:"Required"}),
    relation: z.string().min(2,{message:"Minimum 2 Characters Required"}),
    description: z.string().optional()
})
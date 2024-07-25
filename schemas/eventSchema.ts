// model Event {
//     id             String       @id @default(cuid())
//     organizer      User         @relation(fields: [organizerId], references: [id])
//     organizerId    String
//     title          String
//     description    String
//     fee            Float        @default(0)
//     currency       String
//     organization   Organization @relation(fields: [organizationId], references: [id])
//     organizationId String
//     createdAt      DateTime     @default(now())
//     updatedAt      DateTime     @updatedAt
//   }

import { z } from "zod";

export const EventSchema = z.object({
    title: z.string().min(1,{message:"Required"}),
    description: z.string().min(1,{message:"Required"}),
    fee:z.coerce.number({required_error:"Required"}).default(0),
    currency:z.object({
        value:z.number(),
        label:z.string()
    })
})
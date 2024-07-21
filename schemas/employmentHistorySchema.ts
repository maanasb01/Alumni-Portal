// model EmploymentHistory {
//     id        Int       @id @default(autoincrement())
//     personId  String
//     person    User      @relation(fields: [personId], references: [id])
//     company   String
//     position  String
//     startDate DateTime
//     endDate   DateTime?
//   }

// import { z } from "zod";

// export const EmploymentHistorySchema = z.object({
//     company:z.string().trim().min(1,{message:"Required"}),
//     position:z.string().trim().min(1,{message:"Required"}),
//     startDate:z.date({required_error:"Required"}).max(new Date()),
//     endDate:z.date().max(new Date()).optional(),
// })

import { z } from "zod";

const getCurrentDate = () => {
  const today = new Date();
  today.setHours(24); //next dat 12 am
  today.setMinutes(0);
  return today;
};

export const EmploymentHistorySchema = z
  .object({
    id: z.string().optional(),
    company: z.string().trim().min(1, { message: "Required" }),
    position: z.string().trim().min(1, { message: "Required" }),
    startDate: z
      .date({ required_error: "Required" })
      .max(getCurrentDate(), { message: "Start date cannot be in the future" }),
    endDate: z
      .date()
      .max(getCurrentDate(), { message: "End date cannot be in the future" })
      .optional(),
  })
  .refine((data) => !data.endDate || data.startDate < data.endDate, {
    message: "End date must be greater than the start date",
    path: ["endDate"],
  });

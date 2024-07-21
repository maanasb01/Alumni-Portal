// import { z } from 'zod';

// export const BasicInfoSchema = z.object({
//   name: z.string().trim().min(1, "Name is required"),
//   email: z.string().trim().email("Invalid email"),
//   phone: z.string().trim().regex(/^\+?[1-9]\d{1,14}$/, "Phone number must be in international format, e.g., +1234567890").optional(),
//   degree: z.string().trim().optional(),
// });

import { z } from "zod";

export const BasicInfoSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  email: z.string().trim().email("Invalid email"),
  phone: z
    .string()
    .trim()
    .optional()
    .refine(
      (val) => {
        if (val) {
          return /^\+\d{1,3}\d{4,14}$/.test(val);
        } else {
          return true;
        }
      },
      {
        message:
          "Phone number must be in international format, e.g., +1234567890",
      }
    ),
  degree: z.string().trim().optional(),
});

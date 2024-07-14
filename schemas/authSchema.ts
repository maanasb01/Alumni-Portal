import { z } from "zod";

export const LoginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1,{
        message:"Required"
    })
})

export const RegisterSchema = z.object({
    name:z.string().trim().min(2,{
        message:"Name should be of min 2 characters."
    }),
    email:z.string().email(),
    password: z.string().max(32,"Password must be less than 32 characters").refine(
        (value) =>
          value.length >= 6 &&
          /[!@#$%^&*(),.?":{}|<>]/.test(value) &&
          /\d/.test(value),
        {
          message:
          "Password: Min 6 chars, At least: 1 special char & 1 number",
        }
      ),
      confirmPassword:z.string()
})
.refine((data)=>data.password===data.confirmPassword,{
    message:"Passwords do not match",
    path:["confirmPassword"] // Path to where error should be shown
});
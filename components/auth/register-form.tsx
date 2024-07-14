"use client";

import { useForm } from "react-hook-form";
import CardWrapper from "./card-wrapper";
import { RegisterSchema } from "@/schemas/authSchema";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { register } from "@/actions/register";
import { FormStatus } from "../form-status";

export default function RegisterForm() {
  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
  });

  async function onSubmit(values: z.infer<typeof RegisterSchema>) {

    try{

      const data = await register(values);

      if(data && data.error){
        form.setError("root",{message:data.error});
  
      }

    }
    catch(error){
      form.setError("root",{message:"Something Went Wrong!"});
    }



   
  }

  return (
    <CardWrapper cardTitle="Register" cardDesc="Signup Here" footerText="Already Registered? Login Here" redirectURL="/login">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="">
          <div className=" flex flex-col space-y-2 text-left mb-3">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel> Full Name </FormLabel>
                    <FormControl>
                      <Input placeholder="Full Name" {...field} type="text" />
                    </FormControl>
                    
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel> Email </FormLabel>
                    <FormControl>
                      <Input placeholder="your.email@example.com" {...field} type="email" />
                    </FormControl>
                    
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel> Password </FormLabel>
                    <FormControl>
                      <Input placeholder="Password" {...field} type="password" />
                    </FormControl>
                    
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel> Confirm Password </FormLabel>
                    <FormControl>
                      <Input placeholder="Confirm Password" {...field} type="password" />
                    </FormControl>
                    
                    <FormMessage />
                  </FormItem>
                )}
              />
          <FormStatus type="success" message={form.formState.isSubmitSuccessful ? "Registration Successful!":""} />
          <FormStatus type="error" message={form.formState.errors.root?.message} />
          </div>
          <Button disabled={form.formState.isSubmitting} type="submit" className="">
            Create an Account
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
}

        
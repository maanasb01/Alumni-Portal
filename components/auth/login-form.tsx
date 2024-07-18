"use client";

import { useForm } from "react-hook-form";
import AuthCardWrapper from "./auth-card-wrapper";
import { LoginSchema } from "@/schemas/authSchema";
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
import { FormStatus } from "../form-status";
import { login } from "@/actions/login";

export default function LoginForm() {
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
  });
  

  async function onSubmit(values: z.infer<typeof LoginSchema>) {

    try {
      const data = await login(values);

      if(data && data.error){
        form.setError("root",{message:data.error});
      }
      
    } catch (error) {
      form.setError("root",{message:"Something Went Wrong!"})
    }


   
  }

  return (
    <AuthCardWrapper
      cardTitle="Login"
      cardDesc="Welcome Back!"
      footerText="Don't have an account? Register Here."
      redirectURL="/register"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="">
          <div className=" flex flex-col space-y-2 text-left mb-3">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel> Email </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="your.email@example.com"
                      {...field}
                      type="email"
                    />
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
          <FormStatus type="success" message={form.formState.isSubmitSuccessful ? "Login Successful!":""} />
          <FormStatus type="error" message={form.formState.errors.root?.message} />
          </div>
          <Button disabled={form.formState.isSubmitting} type="submit" className="">
            Submit
          </Button>
        </form>
      </Form>
    </AuthCardWrapper>
  );
}

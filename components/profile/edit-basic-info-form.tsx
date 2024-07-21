"use client";

import { SessionUser } from "@/types/user";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm} from "react-hook-form";
import { Input } from "../ui/input";
import { FormStatus } from "../form-status";
import { Button } from "../ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CardWrapper } from "../card-wrapper";
import { BasicInfoSchema } from "@/schemas/basicInfoSchema";
import { editBasicInfo } from "@/actions/edit/editBasicInfo";
import Link from "next/link";

export function EditBasicInfoForm({ user }: { user: SessionUser }) {
  const form = useForm<z.infer<typeof BasicInfoSchema>>({
    resolver: zodResolver(BasicInfoSchema),
    defaultValues: {
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      degree: user.degree || "",
    },
  });

  async function onSubmit(values: z.infer<typeof BasicInfoSchema>) {

    try {
      const data = await editBasicInfo(values);

      if(data && data.error){
        form.setError("root",{message:data.error});
      }
      
    } catch (error) {
      form.setError("root",{message:"Something Went Wrong!"})
    }


   
  }

  return (
    <>
      <CardWrapper className="text-center" cardTitle="Edit Basic Information">
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
                      <Input placeholder="Email" {...field} type="text" />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel> Phone (optional) </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Phone number in International Format"
                        {...field}
                        type="text"
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="degree"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel> Degree (optional) </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Formal Education Degree"
                        {...field}
                        type="text"
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormStatus
                type="success"
                message={form.formState.isSubmitSuccessful ? "Info Updated Successfully!" : ""}
              />
              <FormStatus
                type="error"
                message={form.formState.errors.root?.message}
              />
            </div>
            <div className="flex space-x-3 justify-center">
                <Button
                  disabled={form.formState.isSubmitting}
                  type="submit"
                  className=""
                >
                  Submit
                </Button>
                <Link href={"/profile"}>
                    <Button
                      disabled={form.formState.isSubmitting}
                      variant={"destructive"}
                      
                    >
                      Cancel
                    </Button>
                </Link>
            </div>
          </form>
        </Form>
      </CardWrapper>
    </>
  );
}

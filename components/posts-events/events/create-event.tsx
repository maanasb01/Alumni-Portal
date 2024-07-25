"use client";

import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../ui/dialog";
import { EventSchema } from "@/schemas/eventSchema";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";
import { FormStatus } from "../../form-status";
import { Button } from "../../ui/button";
import { Textarea } from "../../ui/textarea";
import { FeedEventType } from "@/types/event";
import { Input } from "@/components/ui/input";
import { CurrencySelectAsync } from "./currency-select";
import { createEvent, updateEvent } from "@/actions/posts-events/createEvent";


export function EventDialog({
  event,
  events,
  setEvents,
  children,
}: {
  event?: FeedEventType;
  events: FeedEventType[];
  setEvents: Dispatch<SetStateAction<FeedEventType[]>>;

  children: ReactNode;
}) {
  const form = useForm<z.infer<typeof EventSchema>>({
    resolver: zodResolver(EventSchema),
    defaultValues: {
      title: event ? event.title : "",
      description: event ? event.description : "",
      currency: event ? {label:`${event.currency.name} - ${event.currency.currency} (${event.currency.currencySymbol})`,value:event.currency.id} : null as any,
      fee: event ? parseFloat(event.fee.toString()) : 0
    },
  });
  const [open, setOpen] = useState(false);

  const { reset } = form;
  const { isSubmitSuccessful } = form.formState;

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset({
        title: "",
        description: "",
        currency: null as any,
        fee: 0,
      });
      setOpen(false);
    }
  }, [isSubmitSuccessful, reset]);

  useEffect(() => {
    // Reset the form with the correct values whenever the dialog opens for editing an existing entry
    if (open && event) {
      form.reset({
        title: event.title,
        description: event.description,
        currency: {label:`${event.currency.name} - ${event.currency.currency} (${event.currency.currencySymbol})`,value:event.currency.id},
        fee: parseFloat(event.fee.toString()),
      });
    }
  }, [open, event,form]);

 
  async function onSubmit(values: z.infer<typeof EventSchema>) {
    console.log(values);

    try {
      if (!event) {
        const data = await createEvent(values);
        if (data.error) {
          form.setError("root", { message: data.error });
          return;
        }

        const newEvent = data?.event as FeedEventType;
        if (newEvent) {
          setEvents((prevEvents) => [newEvent, ...prevEvents]);
        }
      } else {
        const data = await updateEvent(values, event.id);
        if (data.error) {
          form.setError("root", { message: data.error });
          return;
        }
        const updatedEvent = data?.event;
        const updatedEvents = events.map((p) => {
          if (p.id === updatedEvent?.id) {
            return updatedEvent;
          }
          return p;
        });
        setEvents(updatedEvents as FeedEventType[]);
      }
      setOpen(false);
    } catch (error) {
      form.setError("root", { message: "Something Went Wrong!" });
    }
  }

  function onCancel() {
    form.reset({
      title: "",
      description: "",
      currency: null as any,
      fee: 0,
    });

    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild aria-describedby="Edit/Update Employment Details">
        {children}
      </DialogTrigger>
      <DialogContent aria-describedby="Edit/Update Employment Details">
        <DialogHeader>
          <DialogTitle className={"text-center"}>Add/Update Event</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="">
            <div className=" flex flex-col space-y-2 text-left mb-3">


              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel> Event Title </FormLabel>
                    <FormControl>
                      <Input placeholder="Event Title" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel> Event Description </FormLabel>
                    <FormControl>
                      <Textarea placeholder="Event Description" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-between">
                <CurrencySelectAsync
                  form={form}
                  name="currency"
                />
  
                <FormField
                  control={form.control}
                  name="fee"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel> Event Fees </FormLabel>
                      <FormControl>
                        <Input placeholder="Event Fees" {...field} type="number" className="w-28" />
                      </FormControl>
  
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              

              {form.formState.isSubmitSuccessful && (
                <FormStatus
                  type="success"
                  message={
                    form.formState.isSubmitSuccessful
                      ? "Info Updated Successfully!"
                      : ""
                  }
                />
              )}
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

              <Button
                disabled={form.formState.isSubmitting}
                variant={"destructive"}
                onClick={onCancel}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

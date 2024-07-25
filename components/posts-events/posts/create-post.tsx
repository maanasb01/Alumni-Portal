"use client";

import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../ui/dialog";
import { PostSchema, PostType } from "@/schemas/postSchema";
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
import { RadioGroup, RadioGroupItem } from "../../ui/radio-group";
import { createPost, updatePost } from "@/actions/posts-events/createPost";
import { FeedPostType } from "@/types/post";



export function PostDialog({
  post,
  posts,
  setPosts,
  children,
}: {

    post?: FeedPostType;
    posts: FeedPostType[];
    setPosts: Dispatch<SetStateAction<FeedPostType[]>>;

  children: ReactNode;
}) {
  const form = useForm<z.infer<typeof PostSchema>>({
    resolver: zodResolver(PostSchema),
    defaultValues: {
      type: post ? post.type : "Regular",
      description: post ? post.description : "",
    },
  });
  const [open, setOpen] = useState(false);

  const { reset } = form;
  const { isSubmitSuccessful } = form.formState;

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset({
        type: "Regular",
        description: "",
      });
      setOpen(false);
    }
  }, [isSubmitSuccessful, reset]);

  useEffect(() => {
    // Reset the form with the correct values whenever the dialog opens for editing an existing entry
    if (open && post) {
      form.reset({
        type: post.type,
        description: post.description,
      });
    }
  }, [open, post,form]);

  async function onSubmit(values: z.infer<typeof PostSchema>) {
    console.log(values);

    try {
      if (!post) {
        const data = await createPost(values);
        if (data.error) {
          form.setError("root", { message: data.error });
          return;
        }

        const newPost = data?.post as FeedPostType;
        if(newPost){
            setPosts(prevPosts=> [newPost,...prevPosts]);
        }
      } else {
        const data = await updatePost(values, post.id);
        if (data.error) {
          form.setError("root", { message: data.error });
          return;
        }
        const updatedPost = data?.post;
        const updatedPosts = posts.map((p) => {
          if (p.id === updatedPost?.id) {
            return updatedPost;
          }
          return p;
        });
        setPosts(updatedPosts  as FeedPostType[]);
      }
      setOpen(false);
    } catch (error) {
      form.setError("root", { message: "Something Went Wrong!" });
    }
  }

  function onCancel() {
    form.reset({
      type: "Regular",
      description: "",
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
          <DialogTitle className={"text-center"}>Add/Update Post</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="">
            <div className=" flex flex-col space-y-2 text-left mb-3">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel> Post Type </FormLabel>
                    <FormControl>
                      <Textarea placeholder="Post Content" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Post Type</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value={PostType.Values.Regular} />
                          </FormControl>
                          <FormLabel className="font-normal">Regular</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem
                              value={PostType.Values.Announcement}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Announcement
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem
                              value={PostType.Values.FinancialEmergency}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Financial Emergency
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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

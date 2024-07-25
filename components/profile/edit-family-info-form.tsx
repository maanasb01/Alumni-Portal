"use client";

import { FamilyMember } from "@prisma/client";
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useState,
} from "react";

import { Button } from "../ui/button";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { FormStatus } from "../form-status";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { v4 as uuid } from "uuid";
import { useRouter } from "next/navigation";
import { CardWrapper } from "../card-wrapper";
import { FamilyMemberSchema } from "@/schemas/familyMembersSchema";
import { Textarea } from "../ui/textarea";
import { updateFamilyMembers } from "@/actions/edit/updateFamilyMembers";
import { ConfirmationDialog } from "../confirmation-dialog";

export function EditFamilyMembers({
  familyMembers,
  userId
}: {
  familyMembers: FamilyMember[];
  userId:string
}) {
  const [members, setMembers] = useState<FamilyMember[]>(familyMembers);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMembers(familyMembers);
  }, [familyMembers]);

  function deleteMemberEntry(member: FamilyMember) {
    const newList = members.filter((m) => m.id !== member.id);
    setMembers(newList);
  }

  async function onSubmit() {
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const data = await updateFamilyMembers(members as any); // Elements in members might have extra fields when fetched from database
      if (data && data.error) {
        setError(data.error);
        return;
      }
      if (data && data.success) {
        setSuccess("Employment Members Updated Successfully!");
        router.push(`/profile/${userId}`);
        router.refresh();
      }
    } catch (error) {
      setError("Something Went Wrong!");
      setSuccess("");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="h-full flex flex-col space-y-2">
      <div className="flex flex-col h-full bg-white shadow-md p-2 rounded-md space-y-3">
        <p className="text-2xl font-bold mb-2">Employment Members</p>
        {members && members.length !== 0 ? (
          <div className="flex flex-col justify-between space-y-4 bg-slate-100 py-5 px-5 rounded-2xl shadow-lg h-[75%] w-3/4 mx-auto relative">
            <div className="flex flex-col overflow-y-auto space-y-3 px-3">
              {members.map((member) => {
                return (
                  <CardWrapper
                    cardTitle={member.name}
                    cardDescription={member.relation}
                    key={member.id}
                    footerJsx={
                      <div className="flex space-x-2">
                        <ConfirmationDialog
                          actionFunction={() => deleteMemberEntry(member)}
                          message={`Are you sure you wish to delete this entry: ${member.name}, ${member.relation}?`}
                        >
                          <Button
                            //   onClick={() => deleteMemberEntry(member)}
                            variant="destructive"
                            size="sm"
                          >
                            Delete
                          </Button>
                        </ConfirmationDialog>
                        <FamilyMembersFormDialog
                          members={members}
                          setMembers={setMembers}
                          member={member}
                        >
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                        </FamilyMembersFormDialog>
                      </div>
                    }
                  >
                    <div className="text-sm">{member.description}</div>
                  </CardWrapper>
                );
              })}
            </div>
            <div className="flex justify-center mt-4 place-self-center">
              <FamilyMembersFormDialog
                members={members}
                setMembers={setMembers}
              >
                <Button size="lg">Add New</Button>
              </FamilyMembersFormDialog>
            </div>
          </div>
        ) : (
          <div>
            <p>No Entries </p>
          </div>
        )}

        {members && members.length !== 0 ? null : (
          <FamilyMembersFormDialog members={members} setMembers={setMembers}>
            <div className="flex justify-center mt-6">
              <Button size="lg">Add New</Button>
            </div>
          </FamilyMembersFormDialog>
        )}
        <div className="flex flex-col justify-center mt-6">
          <FormStatus type="success" message={success} />
          <FormStatus type="error" message={error} />
        </div>
      </div>
      <div className="flex space-x-2 justify-center">
        <form action={onSubmit}>
          <Button size="lg" disabled={loading}>
            {!loading ? "Save" : "Saving..."}
          </Button>
        </form>
        <Link href={"/profile"}>
          <Button variant={"destructive"} size={"lg"}>
            Cancel
          </Button>
        </Link>
      </div>
    </div>
  );
}

export function FamilyMembersFormDialog({
  member,
  members,
  setMembers,
  children,
}: {
  member?: FamilyMember;
  members: FamilyMember[];
  setMembers: Dispatch<SetStateAction<FamilyMember[]>>;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const form = useForm<z.infer<typeof FamilyMemberSchema>>({
    resolver: zodResolver(FamilyMemberSchema),
    defaultValues: {
      name: member ? member.name : "",
      relation: member ? member.relation : "",
      description: member && member.description ? member.description : "",
    },
  });

  const { reset } = form;
  const { isSubmitSuccessful } = form.formState;

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset({
        name: "",
        relation: "",
        description: "",
      });
      setOpen(false);
    }
  }, [isSubmitSuccessful, reset]);

  useEffect(() => {
    // Reset the form with the correct values whenever the dialog opens for editing an existing entry
    if (open && member) {
      form.reset({
        name: member.name,
        relation: member.relation,
        description: member.description || "",
      });
    }
  }, [open, member,form]);

  async function onSubmit(values: z.infer<typeof FamilyMemberSchema>) {
    console.log(values);

    const hasValueOccured = members.some((m) => {
      const sameName = m.name === values.name;
      const sameRelation = m.relation === values.relation;
      const sameDescription =
        m.description && values.description
          ? m.description === values.description
          : false;

      return sameName && sameRelation && sameDescription;
    });
    if (member) {
      const updated = { ...values, id: member.id };
      if (hasValueOccured) {
        form.setError("root", {
          message: "An Employment Entry with same values already exists",
        });
        return;
      }
      const updatedList = members.map((m) => {
        if (m.id === member.id) {
          return updated;
        }
        return m;
      });

      setMembers(updatedList as FamilyMember[]);
    } else {
      if (hasValueOccured) {
        form.setError("root", {
          message: "An Employment Entry with same values already exists",
        });
        return;
      }

      values.id = uuid();
      // Values is infered to as any as FamilyMember schema from prisma has extra fields like personId which are not required
      //in the form and hence not included in zod scema.
      setMembers((prevMembers) => [...prevMembers, values as any]);
    }

    setOpen(false);
  }

  function onCancel() {
    form.reset({
      name: "",
      relation: "",
      description: "",
    });

    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild aria-describedby="Edit/Update Family Details">
        {children}
      </DialogTrigger>
      <DialogContent aria-describedby="Edit/Update Family Details">
        <DialogHeader>
          <DialogTitle className={"text-center"}>
            Add/Update Family Details
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="">
            <div className=" flex flex-col space-y-2 text-left mb-3">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel> Name of the Family Member </FormLabel>
                    <FormControl>
                      <Input placeholder="Name" {...field} type="text" />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="relation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel> Relation of the Family Member </FormLabel>
                    <FormControl>
                      <Input placeholder="Relation" {...field} type="text" />
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
                    <FormLabel> Description (optional) </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Description"
                        className="resize-none"
                        {...field}
                      />
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

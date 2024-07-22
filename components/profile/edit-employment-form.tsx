"use client";

import { EmploymentHistory } from "@prisma/client";
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { FormStatus } from "../form-status";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { EmploymentHistorySchema } from "@/schemas/employmentHistorySchema";
import { Checkbox } from "../ui/checkbox";
import { v4 as uuid } from "uuid";
import { updateEmploymentHistory } from "@/actions/edit/updateEmploymentHistory";
import { useRouter } from "next/navigation";
import { CardWrapper } from "../card-wrapper";
import { ConfirmationDialog } from "../confirmation-dialog";

export function EditEmploymentHistory({
  empHistory,
}: {
  empHistory: EmploymentHistory[];
}) {
  const [history, setHistory] = useState<EmploymentHistory[]>([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const formattedHistory = empHistory.map((emp) => {
      emp.startDate = new Date(emp.startDate);
      emp.endDate = emp.endDate ? new Date(emp.endDate) : null;
      return emp;
    });
    setHistory(formattedHistory);
  }, []);

  function deleteEmploymentEntry(emp: EmploymentHistory) {
    const newList = history.filter((h) => h.id !== emp.id);
    setHistory(newList);
  }

  async function onSubmit() {
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const data = await updateEmploymentHistory(history as any); // Elements in history might have extra fields when fetched from database
      if (data && data.success) {
        setSuccess("Employment History Updated Successfully!");
        router.push("/profile");
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
        <p className="text-2xl font-bold mb-2">Employment History</p>
        {history && history.length !== 0 ? (
          <div className="flex flex-col justify-between space-y-4 bg-slate-100 py-5 px-5 rounded-2xl shadow-lg h-[75%] w-3/4 mx-auto relative">
            <div className="flex flex-col overflow-y-auto space-y-3 px-3">
              {history.map((emp) => {
                return (
                  <CardWrapper
                    cardTitle={emp.company}
                    cardDescription={emp.position}
                    key={emp.id}
                    footerJsx={
                      <div className="flex space-x-2">
                        <ConfirmationDialog
                          actionFunction={() => deleteEmploymentEntry(emp)}
                          message={`Are you sure you want to delete this entry: ${emp.company}, ${emp.position}?`}
                        >
                          <Button variant="destructive" size="sm">
                            Delete
                          </Button>
                        </ConfirmationDialog>
                        <EmploymentHistoryFormDialog
                          history={history}
                          setHistory={setHistory}
                          emp={emp}
                        >
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                        </EmploymentHistoryFormDialog>
                      </div>
                    }
                  >
                    <div className="text-sm">
                      {`${emp.startDate.getDate()}/${
                        emp.startDate.getMonth() + 1
                      }/${emp.startDate.getFullYear()} - ${
                        emp.endDate
                          ? `${emp.endDate.getDate()}/${
                              emp.endDate.getMonth() + 1
                            }/${emp.endDate.getFullYear()}`
                          : "Present"
                      }`}
                    </div>
                  </CardWrapper>
                );
              })}
            </div>
            <div className="flex justify-center mt-4 place-self-center">
              <EmploymentHistoryFormDialog
                history={history}
                setHistory={setHistory}
              >
                <Button size="lg">Add New</Button>
              </EmploymentHistoryFormDialog>
            </div>
          </div>
        ) : (
          <div>
            <p>No Entries </p>
          </div>
        )}

        {history && history.length !== 0 ? null : (
          <EmploymentHistoryFormDialog
            history={history}
            setHistory={setHistory}
          >
            <div className="flex justify-center mt-6">
              <Button size="lg">Add New</Button>
            </div>
          </EmploymentHistoryFormDialog>
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

const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export function EmploymentHistoryFormDialog({
  emp,
  history,
  setHistory,
  children,
}: {
  emp?: EmploymentHistory;
  history: EmploymentHistory[];
  setHistory: Dispatch<SetStateAction<EmploymentHistory[]>>;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [currentlyWorkHere, setCurrentlyWorkHere] = useState(false);
  const form = useForm<z.infer<typeof EmploymentHistorySchema>>({
    resolver: zodResolver(EmploymentHistorySchema),
    defaultValues: {
      company: emp ? emp.company : "",
      position: emp ? emp.position : "",
      startDate: emp ? new Date(emp.startDate) : undefined,
      endDate: emp && emp.endDate ? new Date(emp.endDate) : undefined,
    },
  });

  const { reset } = form;
  const { isSubmitSuccessful } = form.formState;

  useEffect(() => {
    if (currentlyWorkHere) {
      form.setValue("endDate", undefined);
    }
  }, [currentlyWorkHere]);

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset({
        company: "",
        position: "",
        startDate: undefined,
        endDate: undefined,
      });
      setOpen(false);
    }
  }, [isSubmitSuccessful, reset]);

  useEffect(() => {
    // Reset the form with the correct values whenever the dialog opens for editing an existing entry
    if (open && emp) {
      form.reset({
        company: emp.company,
        position: emp.position,
        startDate: emp.startDate,
        endDate: emp.endDate || undefined, // Handle cases where endDate might be null
      });
    }
  }, [open, emp]);

  const isSameDate = (date1: Date, date2: Date) =>
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate();

  async function onSubmit(values: z.infer<typeof EmploymentHistorySchema>) {
    console.log(values);

    const hasValueOccured = history.some((h) => {
      const sameCompany = h.company === values.company;
      const samePosition = h.position === values.position;
      const sameStartDate = isSameDate(h.startDate, values.startDate);
      const sameEndDate =
        h.endDate && values.endDate
          ? isSameDate(h.endDate, values.endDate)
          : h.endDate === values.endDate;

      return sameCompany && samePosition && sameStartDate && sameEndDate;
    });
    if (emp) {
      const updated = { ...values, id: emp.id };
      if (hasValueOccured) {
        form.setError("root", {
          message: "An Employment Entry with same values already exists",
        });
        return;
      }
      const updatedList = history.map((h) => {
        if (h.id === emp.id) {
          return updated;
        }
        return h;
      });

      setHistory(updatedList as EmploymentHistory[]);
    } else {
      if (hasValueOccured) {
        form.setError("root", {
          message: "An Employment Entry with same values already exists",
        });
        return;
      }

      values.id = uuid();
      setHistory((prevHistory) => [...prevHistory, values as any]);
    }

    setOpen(false);
  }

  function onCancel() {
    form.reset({
      company: "",
      position: "",
      startDate: undefined,
      endDate: undefined,
    });

    setOpen(false);
  }

  const today = new Date();
  const maxDate = formatDate(today);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild aria-describedby="Edit/Update Employment Details">
        {children}
      </DialogTrigger>
      <DialogContent aria-describedby="Edit/Update Employment Details">
        <DialogHeader>
          <DialogTitle className={"text-center"}>
            Add/Update Employment
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="">
            <div className=" flex flex-col space-y-2 text-left mb-3">
              <FormField
                control={form.control}
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel> Company </FormLabel>
                    <FormControl>
                      <Input placeholder="Company" {...field} type="text" />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="position"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel> Positon </FormLabel>
                    <FormControl>
                      <Input placeholder="Position" {...field} type="text" />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel> Start Date </FormLabel>
                    <FormControl>
                      <input
                        className="border px-2 py-1 block"
                        placeholder="Start Date"
                        {...field}
                        type="date"
                        value={
                          field.value ? formatDate(new Date(field.value)) : ""
                        }
                        onChange={(e) =>
                          form.setValue("startDate", new Date(e.target.value))
                        }
                        max={maxDate}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex space-x-2 items-center">
                <Label className="text-sm inline-flex items-center cursor-pointer">
                  <Checkbox
                    checked={currentlyWorkHere}
                    onCheckedChange={() =>
                      setCurrentlyWorkHere(!currentlyWorkHere)
                    }
                  />
                  <span className="ml-2">Currently Work Here?</span>
                </Label>
              </div>

              {!currentlyWorkHere ? (
                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel> End Date </FormLabel>
                      <FormControl>
                        <input
                          className="border px-2 py-1 block"
                          placeholder="End Date"
                          {...field}
                          type="date"
                          value={
                            field.value ? formatDate(new Date(field.value)) : ""
                          }
                          onChange={(e) =>
                            form.setValue("endDate", new Date(e.target.value))
                          }
                          max={maxDate}
                          required
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : (
                <div></div>
              )}

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

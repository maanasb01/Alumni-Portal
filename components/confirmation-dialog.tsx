"use client"

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ReactElement, useState, forwardRef, LegacyRef } from "react";

export const ConfirmationDialog = forwardRef((
  {
    message,
    actionFunction,
    children,
  }: {
    message: string;
    actionFunction: () => Promise<any> | any;
    children: ReactElement;
  },
  ref:LegacyRef<HTMLDivElement> | undefined
) => {
  const [error, setError] = useState<string | null>(null);

  const handleAction = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    try {
      await actionFunction();
    } catch (err) {
      setError("Something went wrong while performing action.");
    }
  };

  return (
    <Dialog >
      <DialogTrigger  asChild>{children}</DialogTrigger>
      <DialogContent ref={ref} className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Confirm Action</DialogTitle>
          <DialogDescription>{message}</DialogDescription>
        </DialogHeader>
        {error && <p className="text-red-500 text-sm text-center bg-red-200 py-1 rounded-md">{error}</p>}
        <DialogFooter>
          <form className="flex justify-end" onSubmit={handleAction}>
            <Button size={"sm"} variant={"destructive"} type="submit">
              Confirm
            </Button>
          </form>
          <DialogClose asChild>
            <Button type="button" size={"sm"} variant={"outline"} onClick={() => setError(null)}>
              Cancel
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});
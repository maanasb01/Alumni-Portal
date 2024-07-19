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

import { ReactElement } from "react";

/**
 * A confirmation Dialog to warn user for a certain action. Takes message, action function (usually a server action) to run if user wants to continue,
 * Wrap this component around a UI, which is required to get clicked to open this dialog
 */

export function ConfirmationDialog({
  message,
  actionFunction,
  children,
}: {
  message: string;
  actionFunction: () => any;
  children: ReactElement;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Confirm Action</DialogTitle>
          <DialogDescription>{message}</DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <form
            className="flex justify-end"
            action={async () => {
              "use server";
              await actionFunction();
            }}
          >
            <Button size={"sm"} variant={"destructive"}>
              Confirm
            </Button>
          </form>
          <DialogClose asChild>
            <Button type="button" size={"sm"} variant={"outline"}>
              Cancel
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

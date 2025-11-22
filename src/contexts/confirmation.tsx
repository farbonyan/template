"use client";

import * as React from "react";

import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";

export type ActionButtonProps = {
  label: string;
} & React.ComponentPropsWithoutRef<typeof Button>;

/** Properties for confirmation dialog */
export type Confirmation = {
  title: string;
  message: string;
  buttons?: ActionButtonProps[];
};

export type ConfirmationContextValue = {
  confirm: (confirmation: Confirmation) => void;
};

const ConfirmationContext = React.createContext<
  ConfirmationContextValue | undefined
>(undefined);

export const ConfirmationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [confirmation, setConfirmation] = React.useState<Confirmation>();

  const confirm = React.useCallback((confirmation: Confirmation) => {
    setConfirmation(confirmation);
  }, []);

  return (
    <ConfirmationContext.Provider value={{ confirm }}>
      {children}
      <Dialog
        open={!!confirmation}
        onOpenChange={(open) => {
          !open && setConfirmation(undefined);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{confirmation?.title}</DialogTitle>
          </DialogHeader>
          {confirmation?.message}
          <DialogFooter className="m-1 flex-row justify-end space-x-2 py-1 rtl:space-x-reverse">
            {confirmation?.buttons?.map(({ label, onClick, ...props }) => {
              return (
                <Button
                  key={label}
                  {...props}
                  onClick={(e) => {
                    setConfirmation(undefined);
                    onClick?.(e);
                  }}
                >
                  {label}
                </Button>
              );
            })}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ConfirmationContext.Provider>
  );
};

export const useConfirmation = () => {
  const ctx = React.useContext(ConfirmationContext);
  if (!ctx) {
    throw new Error(
      "useConfirmation hook must be used inside ConfirmationProvider",
    );
  }
  return ctx;
};

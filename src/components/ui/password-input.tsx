import * as React from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";

import type { TextInputProps } from "./text-input";
import { cn } from "~/lib/utils";
import { Button } from "./button";
import { TextInput } from "./text-input";

type PasswordInputProps = Omit<TextInputProps, "type">;

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, ...props }, ref) => {
    const [show, setShow] = React.useState(false);

    return (
      <div className={cn("relative", className)}>
        <TextInput ref={ref} type={show ? "text" : "password"} {...props} />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute end-0 top-0 z-10 hover:bg-transparent"
          onClick={() => setShow((show) => !show)}
        >
          {show ? (
            <EyeOffIcon className="size-4" />
          ) : (
            <EyeIcon className="size-4" />
          )}
        </Button>
      </div>
    );
  },
);
PasswordInput.displayName = "Input";

export { PasswordInput, type PasswordInputProps };

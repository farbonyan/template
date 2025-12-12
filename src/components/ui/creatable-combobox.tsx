import { PlusIcon } from "lucide-react";

import { Button } from "./button";
import { Combobox } from "./combobox";

export type CreatableList<T> = {
  data: T[];
  onCreate?: () => Promise<string | undefined>;
};

export type CreatableComboboxProps = React.ComponentProps<typeof Combobox> & {
  onCreate?: () => Promise<string | undefined>;
};

export const CreatableCombobox = ({
  onCreate,
  ...props
}: CreatableComboboxProps) => {
  return (
    <div className="flex items-center gap-2 overflow-hidden">
      <div className="flex-1">
        <Combobox {...props} />
      </div>
      {onCreate && (
        <Button
          type="button"
          variant="default"
          size="icon"
          className="size-9"
          onClick={() => {
            void onCreate().then(
              (value) => typeof value === "string" && props.setValue?.(value),
            );
          }}
        >
          <PlusIcon className="size-4" />
        </Button>
      )}
    </div>
  );
};

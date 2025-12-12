import { PlusIcon } from "lucide-react";

import { Button } from "./button";
import { MultiSelect } from "./multiselect";

export type CreatableList<T> = {
  data: T[];
  onCreate?: () => Promise<string | undefined>;
};

export type CreatableMultiSelectProps = React.ComponentProps<
  typeof MultiSelect
> & {
  onCreate?: () => Promise<string | undefined>;
};

export const CreatableMultiSelect = ({
  onCreate,
  ...props
}: CreatableMultiSelectProps) => {
  return (
    <div className="flex items-center gap-2 overflow-hidden">
      <div className="flex-1 overflow-hidden">
        <MultiSelect {...props} />
      </div>
      {onCreate && (
        <Button
          type="button"
          variant="default"
          size="icon"
          className="size-9"
          onClick={() => {
            void onCreate().then(
              (value) =>
                typeof value === "string" &&
                props.onValueChange?.([...props.value, value]),
            );
          }}
        >
          <PlusIcon className="size-4" />
        </Button>
      )}
    </div>
  );
};

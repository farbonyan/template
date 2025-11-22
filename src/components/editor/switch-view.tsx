import { Code2Icon, PenIcon } from "lucide-react";

import type { View } from "./type";
import { ToggleGroup, ToggleGroupItem } from "~/components/ui/toggle-group";

type SwitchViewProps = {
  view: View;
  onChangeView: (view: View) => void;
};

export const SwitchView = ({ view, onChangeView }: SwitchViewProps) => {
  return (
    <div className="flex w-full justify-end rounded-md border border-border bg-table-header p-1">
      <ToggleGroup type="single" variant="outline" value={view}>
        <ToggleGroupItem
          size="sm"
          value="html"
          onClick={() => onChangeView("html")}
          className="data-[state=on]:font-semibold"
        >
          <Code2Icon className="me-2 size-4" />
          HTML
        </ToggleGroupItem>
        <ToggleGroupItem
          size="sm"
          value="design"
          onClick={() => onChangeView("design")}
          className="data-[state=on]:font-semibold"
        >
          <PenIcon className="me-2 size-4" />
          Design
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
};

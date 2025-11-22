import type { DragEndEvent } from "@dnd-kit/core";
import type { UseFormReturn } from "react-hook-form";
import * as React from "react";
import {
  closestCenter,
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  ExternalLinkIcon,
  FileQuestionIcon,
  GripVerticalIcon,
  icons,
  PlusIcon,
  Trash2Icon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useFieldArray } from "react-hook-form";

import type { DefaultValues } from "~/components/ui/form";
import type { ColumnSchema } from "~/server/api/schema/column";
import type { TableSchema } from "~/server/api/schema/table";
import type { TemplateSchema } from "~/server/api/schema/template";
import { FormWrapper } from "~/components/forms/form-wrapper";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { Combobox } from "~/components/ui/combobox";
import { DebouncedTextInput } from "~/components/ui/debounced-text-input";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useForm,
} from "~/components/ui/form";
import { Label } from "~/components/ui/label";
import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { TagInput } from "~/components/ui/tag-input";
import { TextInput } from "~/components/ui/text-input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "~/components/ui/vertical-tabs";
import { cn } from "~/lib/utils";
import { templateSchema } from "~/server/api/schema/template";
import { getColumnDefaultData } from "~/utils/database-type";

type ColumnExtraProps = {
  name: "main" | `children.${number}`;
  form: UseFormReturn<TemplateSchema>;
  column: ColumnSchema;
  index: number;
  tables: TableSchema[];
};

const ColumnExtra = ({
  name,
  form,
  column,
  index,
  tables,
}: ColumnExtraProps) => {
  if (column.type === "string") {
    const type = form.watch(`${name}.table.columns.${index}.variant.type`);
    return (
      <div className="flex items-center gap-2 *:flex-1">
        <FormField
          control={form.control}
          name={`${name}.table.columns.${index}.variant.type`}
          render={({ field: { value, onChange, ...field } }) => (
            <FormItem>
              <Select {...field} value={value} onValueChange={onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="text">Text</SelectItem>
                  <SelectItem value="select">Select</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        {type === "select" && (
          <FormField
            control={form.control}
            name={`${name}.table.columns.${index}.variant.options`}
            render={({ field: { value, onChange, ...field } }) => (
              <FormItem>
                <TagInput
                  {...field}
                  tags={value}
                  setTags={(updater) =>
                    typeof updater === "function"
                      ? onChange(updater(value))
                      : onChange(updater)
                  }
                />
                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </div>
    );
  }
  if (column.type === "number") {
    return (
      <FormField
        control={form.control}
        name={`${name}.table.columns.${index}.variant`}
        render={({ field: { value, onChange, ...field } }) => (
          <FormItem>
            <Select
              {...field}
              value={value as "float" | "int" | "bigint"}
              onValueChange={onChange}
            >
              <FormControl>
                <SelectTrigger disabled>
                  <SelectValue />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="int">Int</SelectItem>
                <SelectItem value="bigint">BigInt</SelectItem>
                <SelectItem value="float">Float</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  }
  if (column.type === "date") {
    return (
      <FormField
        control={form.control}
        name={`${name}.table.columns.${index}.variant`}
        render={({ field: { value, onChange, ...field } }) => (
          <FormItem>
            <Select
              {...field}
              value={value as "date" | "datetime"}
              onValueChange={onChange}
            >
              <FormControl>
                <SelectTrigger disabled>
                  <SelectValue />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="datetime">DateTime</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  }
  if (column.type === "boolean") {
    return (
      <FormField
        control={form.control}
        name={`${name}.table.columns.${index}.variant`}
        render={({ field: { value, onChange, ...field } }) => (
          <FormItem>
            <Select
              {...field}
              value={value as "checkbox" | "switch"}
              onValueChange={onChange}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="checkbox">Checkbox</SelectItem>
                <SelectItem value="switch">Switch</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  }
  const tableName = form.watch(`${name}.table.columns.${index}.target.table`);
  const table = tables.find((table) => table.name === tableName);
  return (
    <div className="flex items-center gap-2 *:flex-1">
      <FormField
        control={form.control}
        name={`${name}.table.columns.${index}.target.table`}
        render={({ field }) => (
          <FormItem>
            <Combobox
              value={field.value}
              setValue={field.onChange}
              options={tables.map((table) => ({
                label: table.name,
                value: table.name,
              }))}
            />
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name={`${name}.table.columns.${index}.target.column`}
        render={({ field }) => (
          <FormItem>
            <Combobox
              value={field.value}
              setValue={field.onChange}
              options={
                table?.columns.map((column) => ({
                  label: column.name,
                  value: column.name,
                })) ?? []
              }
            />
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

type SortableRowProps = {
  name: "main" | `children.${number}`;
  index: number;
  form: UseFormReturn<TemplateSchema>;
  column: ColumnSchema;
  tables: TableSchema[];
  columns: ColumnSchema[];
};

const SortableRow = ({
  name,
  index,
  column,
  form,
  tables,
  columns,
}: SortableRowProps) => {
  const t = useTranslations("forms.template");
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: column.name,
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const special = column.primary
    ? "primary"
    : column.parent
      ? "parent"
      : column.title
        ? "title"
        : "none";

  const table = form.watch(`${name}.table.columns.${index}.table`);

  return (
    <TableRow ref={setNodeRef} style={style} {...attributes}>
      <TableCell
        className="w-4 cursor-grab active:cursor-grabbing"
        {...listeners}
      >
        <GripVerticalIcon className="h-4 w-4 text-muted-foreground" />
      </TableCell>
      <TableCell>{column.name}</TableCell>
      <TableCell>
        <FormField
          control={form.control}
          name={`${name}.table.columns.${index}.label`}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <TextInput {...field} placeholder={t("label.placeholder")} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </TableCell>
      <TableCell>
        <FormItem>
          <Select
            value={special}
            onValueChange={(value) => {
              switch (value) {
                case "none":
                  form.setValue(
                    `${name}.table.columns`,
                    form.getValues(`${name}.table.columns`).map((c, i) =>
                      i === index
                        ? {
                            ...c,
                            primary: false,
                            title: false,
                            parent: false,
                          }
                        : c,
                    ),
                  );
                  break;
                case "primary":
                  form.setValue(
                    `${name}.table.columns`,
                    form.getValues(`${name}.table.columns`).map((c, i) => ({
                      ...c,
                      primary: i === index ? true : false,
                    })),
                  );
                  break;
                case "parent":
                  form.setValue(
                    `${name}.table.columns`,
                    form.getValues(`${name}.table.columns`).map((c, i) => ({
                      ...c,
                      parent: i === index ? true : false,
                    })),
                  );
                  break;
                case "title":
                  form.setValue(
                    `${name}.table.columns`,
                    form.getValues(`${name}.table.columns`).map((c, i) => ({
                      ...c,
                      title: i === index ? true : false,
                    })),
                  );
              }
            }}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              <SelectItem value="primary">Primary</SelectItem>
              <SelectItem value="parent">Parent</SelectItem>
              <SelectItem value="title">Title</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      </TableCell>
      <TableCell>
        <FormField
          control={form.control}
          name={`${name}.table.columns.${index}.optional`}
          render={({ field: { value, onChange, ...field } }) => (
            <FormItem>
              <FormControl>
                <Checkbox
                  disabled
                  {...field}
                  checked={value}
                  onCheckedChange={onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </TableCell>
      <TableCell>
        <FormField
          control={form.control}
          name={`${name}.table.columns.${index}.table`}
          render={({ field: { value, onChange, ...field } }) => (
            <FormItem>
              <FormControl>
                <Checkbox
                  {...field}
                  checked={value}
                  onCheckedChange={onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </TableCell>
      <TableCell>
        <FormField
          control={form.control}
          name={`${name}.table.columns.${index}.hide`}
          render={({ field: { value, onChange, ...field } }) => {
            return (
              <FormItem>
                <FormControl>
                  <Checkbox
                    {...field}
                    disabled={!table}
                    checked={value}
                    onCheckedChange={onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
      </TableCell>
      <TableCell>
        <FormField
          control={form.control}
          name={`${name}.table.columns.${index}.grouped`}
          render={({ field: { value, onChange, ...field } }) => {
            return (
              <FormItem>
                <FormControl>
                  <Checkbox
                    {...field}
                    disabled={!table}
                    checked={value}
                    onCheckedChange={onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
      </TableCell>
      <TableCell>
        <FormField
          control={form.control}
          name={`${name}.table.columns.${index}.search`}
          render={({ field: { value, onChange, ...field } }) => {
            return (
              <FormItem>
                <FormControl>
                  <Checkbox
                    {...field}
                    disabled={!table}
                    checked={value}
                    onCheckedChange={onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
      </TableCell>
      <TableCell>
        <FormField
          control={form.control}
          name={`${name}.table.columns.${index}.form`}
          render={({ field: { value, onChange, ...field } }) => (
            <FormItem>
              <FormControl>
                <Checkbox
                  {...field}
                  checked={value}
                  onCheckedChange={onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </TableCell>
      <TableCell>
        <FormField
          control={form.control}
          name={`${name}.table.columns.${index}.related`}
          render={({ field }) => {
            const related = form
              .getValues(`${name}.table.columns`)
              .find((column) => column.name === field.value?.field);
            return (
              <FormItem>
                <div className="flex items-center gap-2">
                  <Select
                    value={field.value?.field ?? "null"}
                    onValueChange={(value) => {
                      if (value === "null") {
                        return field.onChange(null);
                      }
                      field.onChange({
                        field: value,
                        value: undefined,
                      });
                    }}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="null">None</SelectItem>
                      {columns
                        .filter(
                          (column) =>
                            column.type === "string" &&
                            column.variant.type === "select",
                        )
                        .map((column) => (
                          <SelectItem key={column.name} value={column.name}>
                            {column.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  {field.value?.field && (
                    <Select
                      value={field.value.value}
                      onValueChange={(value) => {
                        field.onChange({
                          field: field.value?.field,
                          value: value,
                        });
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {related?.type === "string" &&
                          related.variant.type === "select" &&
                          related.variant.options.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
                <FormMessage />
              </FormItem>
            );
          }}
        />
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1">
          {column.type}
          {["number", "string"].includes(column.type) && (
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="size-6"
              onClick={() =>
                form.setValue(`${name}.table.columns.${index}.type`, "relation")
              }
            >
              <ExternalLinkIcon className="size-4 text-primary" />
            </Button>
          )}
        </div>
      </TableCell>
      <TableCell>
        <ColumnExtra
          name={name}
          form={form}
          column={column}
          index={index}
          tables={tables}
        />
      </TableCell>
    </TableRow>
  );
};

type SortableTableProps = {
  name: "main" | `children.${number}`;
  form: UseFormReturn<TemplateSchema>;
  tables: TableSchema[];
  columns: ColumnSchema[];
};

const SortableTable = ({ name, form, tables, columns }: SortableTableProps) => {
  const t = useTranslations("forms.template");
  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = columns.findIndex((col) => col.name === active.id);
    const newIndex = columns.findIndex((col) => col.name === over.id);
    const reordered = arrayMove(columns, oldIndex, newIndex);
    form.setValue(
      `${name}.table.columns`,
      reordered.map((c, i) => ({ ...c, order: i })),
    );
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <ScrollArea className="flex-1 rounded border [&>div>div]:h-full">
        <Table>
          <TableHeader className="sticky top-0 z-30 shadow-md [&_tr]:border-b-0">
            <TableRow className="divide-x-2 rtl:divide-x-reverse">
              <TableHead rowSpan={2}></TableHead>
              <TableHead rowSpan={2}>{t("column.name")}</TableHead>
              <TableHead rowSpan={2}>{t("column.label")}</TableHead>
              <TableHead rowSpan={2}>{t("column.special")}</TableHead>
              <TableHead rowSpan={2}>{t("column.optional")}</TableHead>
              <TableHead colSpan={5} className="border-b text-center">
                {t("column.visual")}
              </TableHead>
              <TableHead rowSpan={2}>{t("column.related")}</TableHead>
              <TableHead rowSpan={2}>{t("column.type")}</TableHead>
              <TableHead rowSpan={2}>{t("column.extra")}</TableHead>
            </TableRow>
            <TableRow className="divide-x-2 rtl:divide-x-reverse">
              <TableHead className="border-s-2">{t("column.table")}</TableHead>
              <TableHead>{t("column.hide")}</TableHead>
              <TableHead>{t("column.grouped")}</TableHead>
              <TableHead>{t("column.search")}</TableHead>
              <TableHead>{t("column.form")}</TableHead>
            </TableRow>
          </TableHeader>
          <SortableContext
            items={columns.map((col) => col.name)}
            strategy={verticalListSortingStrategy}
          >
            <TableBody>
              {columns
                .sort((a, b) => a.order - b.order)
                .map((column, index) => {
                  return (
                    <SortableRow
                      key={column.name}
                      name={name}
                      index={index}
                      column={column}
                      form={form}
                      columns={columns}
                      tables={tables}
                    />
                  );
                })}
              <TableRow className="h-[calc(100%-1px)]"></TableRow>
            </TableBody>
          </SortableContext>
        </Table>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </DndContext>
  );
};

type TableFieldProps = {
  name: "main" | `children.${number}`;
  form: UseFormReturn<TemplateSchema>;
  selectTables: TableSchema[];
  tables: TableSchema[];
  onCreate?: () => void;
};

const TableField = ({
  name,
  form,
  selectTables,
  tables,
  onCreate,
}: TableFieldProps) => {
  const t = useTranslations("forms.template");

  const columns = form.watch(`${name}.table.columns`);

  return (
    <div className="flex h-full flex-col space-y-4 overflow-hidden">
      <FormField
        control={form.control}
        name={`${name}.table.name`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("table.label")}</FormLabel>
            <div className="flex items-center gap-2">
              <FormControl>
                <Combobox
                  value={field.value}
                  setValue={(value) => {
                    field.onChange(value);
                    const table = selectTables.find((t) => t.name === value);
                    const names = form.getValues([
                      `${name}.name.singular`,
                      `${name}.name.plural`,
                    ]);
                    if (table && !names[0] && !names[1]) {
                      const entityName = table.name.includes("_")
                        ? table.name.split("_").slice(1).join("_")
                        : table.name;
                      form.setValue(`${name}.name`, {
                        singular: entityName,
                        plural: `${entityName}s`,
                      });
                    }
                    const columns = table?.columns ?? [];
                    form.setValue(
                      `${name}.table.columns`,
                      columns.map((column, index) =>
                        getColumnDefaultData({ index, column, columns }),
                      ),
                    );
                  }}
                  options={selectTables.map((table) => ({
                    label: table.name,
                    value: table.name,
                  }))}
                  placeholder={t("table.placeholder")}
                />
              </FormControl>
              {onCreate && (
                <Button type="button" size="icon" onClick={onCreate}>
                  <PlusIcon className="size-4" />
                </Button>
              )}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name={`${name}.table.columns`}
        render={() => (
          <FormItem className="flex flex-1 flex-col overflow-hidden">
            <FormLabel>{t("columns.label")}</FormLabel>
            <SortableTable
              name={name}
              form={form}
              tables={tables}
              columns={columns}
            />
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

type FormFieldProps = {
  name: "main" | `children.${number}`;
  form: UseFormReturn<TemplateSchema>;
  selectTables: TableSchema[];
  tables: TableSchema[];
  onCreate?: () => void;
};

const FormTableField = ({
  name,
  form,
  selectTables,
  tables,
  onCreate,
}: FormFieldProps) => {
  const t = useTranslations("forms.template");

  return (
    <div className="flex h-full flex-col space-y-4">
      <FormItem>
        <Label>{t("name.label")}</Label>
        <div className="flex items-center gap-2 *:flex-1">
          <FormField
            control={form.control}
            name={`${name}.name.singular`}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <TextInput
                    {...field}
                    placeholder={t("singular.placeholder")}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={`${name}.name.plural`}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <TextInput {...field} placeholder={t("plural.placeholder")} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </FormItem>
      <FormItem>
        <Label>{t("name.label")}</Label>
        <div className="flex items-center gap-2 *:flex-1">
          <FormField
            control={form.control}
            name={`${name}.label.singular`}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <TextInput
                    {...field}
                    placeholder={t("singular.placeholder")}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={`${name}.label.plural`}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <TextInput {...field} placeholder={t("plural.placeholder")} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </FormItem>
      <div className="flex-1 overflow-hidden">
        <TableField
          name={name}
          form={form}
          selectTables={selectTables}
          tables={tables}
          onCreate={onCreate}
        />
      </div>
    </div>
  );
};

export type TemplateFormProps = {
  /** Form loading state */
  loading?: boolean;

  /** List of tables */
  tables: TableSchema[];

  /** Default template of the form */
  defaultValues?: DefaultValues<TemplateSchema>;

  /** Submit handler function */
  onSubmit: (values: TemplateSchema) => void;
};

/**
 * Template form component
 */
export const TemplateForm = ({
  loading,
  tables,
  defaultValues,
  onSubmit,
}: TemplateFormProps) => {
  const t = useTranslations("forms.template");
  const form = useForm({
    schema: templateSchema,
    defaultValues: defaultValues ?? {
      icon: "",
      main: {
        name: {
          singular: "",
          plural: "",
        },
        label: {
          singular: "",
          plural: "",
        },
        table: { name: "", columns: [] },
      },
      children: [],
    },
  });
  const [value, setValue] = React.useState("base");
  const [search, setSearch] = React.useState("");
  const [open, setOpen] = React.useState(false);

  const children = form.watch("children");
  const tableName = form.watch("main.table.name");
  const relatedTables = tables.filter((table) =>
    table.columns.some(
      (column) => column.relation?.split(".")[0] === tableName,
    ),
  );

  const childrenField = useFieldArray({
    control: form.control,
    name: "children",
  });

  return (
    <Form {...form} disabled={loading}>
      <FormWrapper onSubmit={form.handleSubmit(onSubmit)}>
        <Tabs value={value} onValueChange={setValue} className="h-full">
          <TabsList
            className={cn(
              "flex flex-col border *:flex-1",
              !children?.length && "hidden",
            )}
          >
            <TabsTrigger value="base">{t("tabs.base")}</TabsTrigger>
            {children?.map((_, index) => (
              <TabsTrigger
                key={index}
                value={`table.${index}`}
                className="flex items-center justify-center gap-2"
              >
                <Trash2Icon
                  className="size-4 text-destructive"
                  onClick={() => {
                    childrenField.remove(index);
                    setValue("base");
                  }}
                />
                {t("tabs.sub-table", { index: index + 1 })}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value="base" className="overflow-hidden">
            <div className="flex h-full flex-col space-y-4 overflow-hidden p-1">
              <FormField
                control={form.control}
                name="icon"
                render={({ field }) => {
                  const Icon = field.value
                    ? icons[field.value as keyof typeof icons]
                    : FileQuestionIcon;
                  return (
                    <FormItem className="flex items-center gap-4">
                      <FormLabel>{t("icon.label")}</FormLabel>
                      <FormControl>
                        <Dialog open={open} onOpenChange={setOpen}>
                          <DialogTrigger asChild>
                            <Button type="button" size="icon" variant="outline">
                              <Icon className="size-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogTitle>{t("icon.label")}</DialogTitle>
                            <div className="m-1">
                              <DebouncedTextInput
                                value={search}
                                onChange={setSearch}
                              />
                              <ScrollArea className="mt-2 h-80">
                                <ul className="grid grid-cols-8 gap-4">
                                  {Object.entries(icons)
                                    .filter(([name]) =>
                                      name
                                        .toLowerCase()
                                        .includes(search.toLowerCase()),
                                    )
                                    .map(([name, Icon]) => {
                                      return (
                                        <Button
                                          key={name}
                                          type="button"
                                          size="icon"
                                          variant="ghost"
                                          onClick={() => {
                                            field.onChange(name);
                                            setOpen(false);
                                          }}
                                        >
                                          <Icon
                                            className={cn(
                                              "size-6",
                                              field.value === name &&
                                                "text-success",
                                            )}
                                          />
                                        </Button>
                                      );
                                    })}
                                </ul>
                              </ScrollArea>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <div className="flex-1 overflow-hidden">
                <FormTableField
                  name="main"
                  form={form}
                  selectTables={tables}
                  tables={tables}
                  onCreate={
                    relatedTables.length
                      ? () => {
                          childrenField.append({
                            name: {
                              singular: "",
                              plural: "",
                            },
                            label: {
                              singular: "",
                              plural: "",
                            },
                            table: { name: "", columns: [] },
                          });
                        }
                      : undefined
                  }
                />
              </div>
            </div>
          </TabsContent>
          {children?.map((_, index) => (
            <TabsContent
              key={index}
              value={`table.${index}`}
              className="overflow-hidden"
            >
              <FormTableField
                name={`children.${index}`}
                form={form}
                selectTables={relatedTables}
                tables={tables}
              />
            </TabsContent>
          ))}
        </Tabs>
      </FormWrapper>
    </Form>
  );
};

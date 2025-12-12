import type { ColumnSchema } from "~/server/api/schema/column";
import type { TableColumnSchema } from "~/server/api/schema/table";

// Normalize SQLite types → your internal types
export const getType = (type: string) => {
  const t = type.toLowerCase();

  // SQLite affinity rules
  if (t.includes("char") || t.includes("text") || t.includes("clob"))
    return "string";

  if (
    t === "int" ||
    t.includes("int") // INTEGER, BIGINT, TINYINT, etc.
  )
    return "number";

  if (t.includes("real") || t.includes("floa") || t.includes("doub"))
    return "number";

  if (t.includes("bool")) return "boolean";

  if (t.includes("date") || t.includes("time")) return "date";

  if (t.includes("blob")) return "string"; // treat as string (or file) depending on your UI

  // Fallback
  return "string";
};

const defaults: Record<string, Partial<ColumnSchema>> = {
  createdAt: { table: true, form: false },
  updatedAt: { table: true, form: false },
  deletedAt: { table: false, form: false },
};

export const getColumnDefaultData = ({
  index,
  column,
  columns,
}: {
  column: TableColumnSchema;
  columns: TableColumnSchema[];
  index: number;
}): ColumnSchema => {
  const base = {
    order: index,
    name: column.name,
    label: column.description ?? "",
    primary: column.primary,
    title:
      columns
        .filter((c) => !c.relation && getType(c.type) === "string")
        .findIndex((c) => c.name === column.name) == 0,
    parent: false,
    optional: column.optional,
    table: true,
    hide: column.primary,
    grouped: false,
    form: !column.primary,
    related: null,
    ...defaults[column.name],
  };

  // Relations
  if (column.relation) {
    const [table, col] = column.relation.split(".");
    return {
      ...base,
      type: "relation",
      search: true,
      target: {
        table: table ?? "",
        column: col ?? "",
      },
    };
  }

  //
  // SQLite type logic
  //

  const t = column.type.toLowerCase();

  // Dates
  if (t.includes("date") || t.includes("time")) {
    return {
      ...base,
      search: false,
      type: "date",
      variant: t.includes("time") ? "datetime" : "date",
    };
  }

  // Integers
  if (t.includes("int")) {
    return {
      ...base,
      search: false,
      type: "number",
      variant: "int",
    };
  }

  // Real / Float / Double
  if (t.includes("real") || t.includes("floa") || t.includes("doub")) {
    return {
      ...base,
      search: false,
      type: "number",
      variant: "float",
    };
  }

  // Boolean
  if (t.includes("bool")) {
    return {
      ...base,
      search: false,
      type: "boolean",
      variant: "switch",
    };
  }

  // Default: treat as TEXT
  const variant = { type: "text", options: [] } as const;
  return {
    ...base,
    search: !column.primary,
    type: "string",
    variant,
  };
};

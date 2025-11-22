import type { FormSchema } from "../../schema/form";
import type { TableSchema } from "../../schema/table";
import type { TemplateSchema } from "../../schema/template";
import { getType } from "~/utils/database-type";
import { getCases } from "./cases";

const getTableContext = ({
  tables,
  table,
}: {
  tables: TableSchema[];
  table: FormSchema["table"];
}) => {
  const selectColumns = table.columns.filter(
    (col) => col.type === "string" && col.variant.type === "select",
  );
  const tableColumns = table.columns.filter((col) => col.table);
  const formColumns = table.columns.filter((col) => col.form);

  const columns = table.columns.map((column, index) => {
    const relation =
      column.type === "relation"
        ? tables.find((table) => table.name === column.target.table)
        : undefined;
    const relationPrimary = relation?.columns.find((c) => c.primary);
    const selectIndex = selectColumns.findIndex((c) => c.name === column.name);
    const tableIndex = tableColumns.findIndex((c) => c.name === column.name);
    const formIndex = formColumns.findIndex((c) => c.name === column.name);
    return {
      name: {
        ...getCases(column.name),
        cleaned:
          column.type === "relation"
            ? getCases(column.name.slice(0, -2))
            : undefined,
      },
      label: column.label,
      order: column.order,
      type: column.type,

      isNotGrouped:
        column.name.toLowerCase().endsWith("id") ||
        column.name.toLowerCase().endsWith("year") ||
        column.name.toLowerCase().endsWith("month"),

      isPrimary: column.primary,
      isTitle: column.title,
      isParent: column.parent,
      isTable: column.table,
      isHide: column.table && column.hide,
      isGrouped: column.table && column.grouped,
      isSearch: column.table && column.search,
      tableComma: tableIndex < tableColumns.length - 1 ? "," : "",
      isForm: column.form,
      formComma: formIndex < formColumns.length - 1 ? "," : "",
      isOptional: column.optional,

      isString: column.type === "string",
      isText: column.type === "string" && column.variant.type === "text",
      isSelect: column.type === "string" && column.variant.type === "select",
      selectComma: selectIndex < selectColumns.length - 1 ? "," : "",
      options:
        column.type === "string" && column.variant.type === "select"
          ? column.variant.options.map((option, idx) => ({
              option,
              comma:
                column.variant.type === "select" &&
                idx < column.variant.options.length - 1
                  ? ","
                  : "",
            }))
          : [],
      firstOption:
        column.type === "string" && column.variant.type === "select"
          ? column.variant.options[0]
          : undefined,

      isNumber: column.type === "number",
      isBigInt: column.type === "number" && column.variant === "bigint",
      isInt: column.type === "number" && column.variant === "int",
      isFloat: column.type === "number" && column.variant === "float",

      isDate: column.type === "date",
      isDateOnly: column.type === "date" && column.variant === "date",
      isDateTime: column.type === "date" && column.variant === "datetime",

      isBoolean: column.type === "boolean",
      isCheckbox: column.type === "boolean" && column.variant === "checkbox",
      isSwitch: column.type === "boolean" && column.variant === "switch",

      isRelation: column.type === "relation",
      relation:
        column.type === "relation" && relation
          ? {
              table: getCases(column.target.table),
              column: getCases(column.target.column),
              primary: relationPrimary
                ? {
                    name: getCases(relationPrimary.name),
                    isText: getType(relationPrimary.type) === "string",
                    isNumber: getType(relationPrimary.type) === "number",
                  }
                : undefined,
            }
          : undefined,

      isRelatedTo: table.columns.some((c) => c.related?.field === column.name),
      isRelated: !!column.related,
      related: column.related
        ? { field: getCases(column.related.field), value: column.related.value }
        : undefined,

      comma: index < table.columns.length - 1 ? "," : "",
    };
  });
  const primary = columns.find((column) => column.isPrimary)!;
  const title = columns.find((column) => column.isTitle)!;
  const parent = columns.find((column) => column.isParent);

  return {
    name: getCases(table.name),
    tree: !!parent,
    softDelete: !!table.columns.find((column) => column.name === "deletedAt"),
    specialColumns: {
      title: title,
      primary: primary,
      parent: parent,
    },
    columns: columns.sort((a, b) => a.order - b.order),
    form: {
      isLarge: columns.filter((column) => column.isForm).length > 5,
      hasNumber: columns
        .filter((column) => column.isForm)
        .some((column) => column.isNumber),
      hasText: columns
        .filter((column) => column.isForm)
        .some((column) => column.isText),
      hasSelect: columns
        .filter((column) => column.isForm)
        .some((column) => column.isSelect),
      hasDate: columns
        .filter((column) => column.isForm)
        .some((column) => column.isDate),
      hasBoolean: columns
        .filter((column) => column.isForm)
        .some((column) => column.isBoolean),
      hasCheckbox: columns
        .filter((column) => column.isForm)
        .some((column) => column.isCheckbox),
      hasSwitch: columns
        .filter((column) => column.isForm)
        .some((column) => column.isSwitch),
      hasRelated: columns
        .filter((column) => column.isForm)
        .some((column) => column.isRelated),
      hasRelation: columns
        .filter((column) => column.isForm)
        .some((column) => column.isRelation),
    },
    table: {
      hasNumber: columns
        .filter((column) => column.isTable)
        .some((column) => column.isNumber),
      hasText: columns
        .filter((column) => column.isTable)
        .some((column) => column.isText),
      hasSelect: columns
        .filter((column) => column.isTable)
        .some((column) => column.isSelect),
      hasDate: columns
        .filter((column) => column.isTable)
        .some((column) => column.isDate),
      hasBoolean: columns
        .filter((column) => column.isTable)
        .some((column) => column.isBoolean),
      hasCheckbox: columns
        .filter((column) => column.isTable)
        .some((column) => column.isCheckbox),
      hasSwitch: columns
        .filter((column) => column.isTable)
        .some((column) => column.isSwitch),
      hasRelated: columns
        .filter((column) => column.isTable)
        .some((column) => column.isRelated),
      hasRelation: columns
        .filter((column) => column.isTable)
        .some((column) => column.isRelation),
    },
    hasNumber: columns.some((column) => column.isNumber),
    hasText: columns.some((column) => column.isText),
    hasSelect: columns.some((column) => column.isSelect),
    hasDate: columns.some((column) => column.isDate),
    hasBoolean: columns.some((column) => column.isBoolean),
    hasCheckbox: columns.some((column) => column.isCheckbox),
    hasSwitch: columns.some((column) => column.isSwitch),
    hasRelated: columns.some((column) => column.isRelated),
    hasRelation: columns.some((column) => column.isRelation),
  };
};

const getFormContext = ({
  form,
  tables,
}: {
  tables: TableSchema[];
  form: FormSchema;
}) => {
  return {
    name: {
      singular: getCases(form.name.singular),
      plural: getCases(form.name.plural),
    },
    label: {
      singular: form.label.singular,
      plural: form.label.plural,
    },
    table: getTableContext({ table: form.table, tables }),
  };
};

export const getContext = ({
  template,
  tables,
}: {
  template: TemplateSchema;
  tables: TableSchema[];
}) => {
  return {
    icon: template.icon,
    main: getFormContext({ form: template.main, tables }),
    children:
      template.children?.map((child, index) => ({
        ...getFormContext({ form: child, tables }),
        comma: index < template.children!.length - 1 ? "," : "",
      })) ?? [],
    isComplex: !!template.children?.length,
  };
};

export type Context = ReturnType<typeof getContext>;

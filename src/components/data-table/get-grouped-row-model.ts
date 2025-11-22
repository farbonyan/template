import type { Row, RowData, Table } from "@tanstack/react-table";
import {
  createRow,
  flattenBy,
  getMemoOptions,
  memo,
} from "@tanstack/react-table";

export const getGroupedRowModel = <TData extends RowData>() => {
  return (table: Table<TData>) =>
    memo(
      () => [table.getState().grouping, table.getPreGroupedRowModel()],
      (grouping, rowModel) => {
        if (!rowModel.rows.length || !grouping.length) {
          return rowModel;
        }

        // Filter the grouping list down to columns that exist
        const existingGrouping = grouping.filter((columnId) =>
          table.getColumn(columnId),
        );

        const groupedFlatRows: Row<TData, TData>[] = [];
        const groupedRowsById: Record<string, Row<TData, TData>> = {};

        // Recursively group the data
        const groupUpRecursively = (
          rows: Row<TData, TData>[],
          depth = 0,
          parentId?: string,
        ) => {
          // Grouping depth has been been met
          // Stop grouping and simply rewrite the depth and row relationships
          if (depth >= existingGrouping.length) {
            return rows.map((row) => {
              row.depth = depth;

              groupedFlatRows.push(row);
              groupedRowsById[row.id] = row;

              if (row.subRows.length) {
                row.subRows = groupUpRecursively(
                  row.subRows,
                  depth + 1,
                  row.id,
                );
              }

              return row;
            });
          }

          const columnId: string = existingGrouping[depth]!;

          // Group the rows together for this level
          const rowGroupsMap = groupBy(rows, columnId);

          // Perform aggregations for each group
          const aggregatedGroupedRows = Array.from(rowGroupsMap.entries()).map(
            ([groupingValue, groupedRows], index) => {
              let id = `${columnId}:${groupingValue}`;
              id = parentId ? `${parentId}>${id}` : id;

              // First, Recurse to group sub rows before aggregation
              const subRows = groupUpRecursively(groupedRows, depth + 1, id);

              // Flatten the leaf rows of the rows in this group
              const leafRows = depth
                ? flattenBy(groupedRows, (row) => row.subRows)
                : groupedRows;

              const row = createRow(
                table,
                id,
                leafRows[0]!.original,
                index,
                depth,
                undefined,
                parentId,
              );

              Object.assign(row, {
                groupingColumnId: columnId,
                groupingValue,
                subRows,
                leafRows,
                getValue: (columnId: string) => {
                  // Don't aggregate columns that are in the grouping
                  if (existingGrouping.includes(columnId)) {
                    if (
                      Object.prototype.hasOwnProperty.call(
                        row._valuesCache,
                        columnId,
                      )
                    ) {
                      return row._valuesCache[columnId];
                    }

                    if (groupedRows[0]) {
                      row._valuesCache[columnId] =
                        groupedRows[0].getValue(columnId) ?? undefined;
                    }

                    return row._valuesCache[columnId];
                  }

                  if (
                    Object.prototype.hasOwnProperty.call(
                      row._groupingValuesCache,
                      columnId,
                    )
                  ) {
                    return row._groupingValuesCache[columnId] as unknown;
                  }

                  // Aggregate the values
                  const column = table.getColumn(columnId);
                  const aggregateFn = column?.getAggregationFn();

                  if (aggregateFn) {
                    row._groupingValuesCache[columnId] = aggregateFn(
                      columnId,
                      leafRows,
                      groupedRows,
                    ) as unknown;

                    return row._groupingValuesCache[columnId] as unknown;
                  }
                },
              });

              subRows.forEach((subRow) => {
                groupedFlatRows.push(subRow);
                groupedRowsById[subRow.id] = subRow;
              });

              return row;
            },
          );

          const resultGroupedRows: Row<TData, TData>[] = [];
          aggregatedGroupedRows.forEach((subRow) => {
            const aggregatedSubRow = { ...subRow };
            Object.assign(aggregatedSubRow, {
              id: `aggregated:${subRow.id}`,
              subRows: [],
              isAggregated: true,
            });
            resultGroupedRows.push(subRow);
            resultGroupedRows.push(aggregatedSubRow);
          });

          return resultGroupedRows;
        };

        const groupedRows = groupUpRecursively(rowModel.rows, 0);

        groupedRows.forEach((subRow) => {
          groupedFlatRows.push(subRow);
          groupedRowsById[subRow.id] = subRow;
        });

        return {
          rows: groupedRows,
          flatRows: groupedFlatRows,
          rowsById: groupedRowsById,
        };
      },
      getMemoOptions(table.options, "debugTable", "getGroupedRowModel", () => {
        table._queue(() => {
          table._autoResetExpanded();
          table._autoResetPageIndex();
        });
      }),
    );
};

const groupBy = <TData extends RowData>(
  rows: Row<TData, TData>[],
  columnId: string,
) => {
  const groupMap = new Map<string, Row<TData, TData>[]>();

  return rows.reduce((map, row) => {
    const resKey = `${row.getGroupingValue(columnId) as string}`;
    const previous = map.get(resKey);
    if (!previous) {
      map.set(resKey, [row]);
    } else {
      previous.push(row);
    }
    return map;
  }, groupMap);
};

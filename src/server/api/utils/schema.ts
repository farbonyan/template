import type { PrismaClient } from "@prisma/client";

import type { TableColumnSchema } from "../schema/table";

export const getSchema = async (db: PrismaClient) => {
  // 1) List tables
  const tables = await db.$queryRaw<{ name: string }[]>`
    SELECT name
    FROM sqlite_master
    WHERE type = 'table'
      AND name NOT LIKE 'sqlite_%'
  `;

  const tablesMap: Record<string, TableColumnSchema[]> = {};

  for (const t of tables) {
    const table = t.name;

    // 2) Columns (PRAGMA)
    const columns = await db.$queryRawUnsafe<
      {
        cid: number;
        name: string;
        type: string;
        notnull: 0 | 1;
        dflt_value: string | null;
        pk: 0 | 1;
      }[]
    >(`PRAGMA table_info(${table})`);

    // 3) Foreign keys (PRAGMA)
    const fks = await db.$queryRawUnsafe<
      {
        id: number;
        seq: number;
        table: string; // referenced table
        from: string; // column
        to: string; // referenced column
        on_update: string;
        on_delete: string;
        match: string;
      }[]
    >(`PRAGMA foreign_key_list(${table})`);

    const fkMap = new Map<string, string>();
    for (const fk of fks) {
      fkMap.set(`${table}.${fk.from}`, `${fk.table}.${fk.to}`);
    }

    tablesMap[table] = columns.map((col) => ({
      name: col.name,
      type: col.type,
      optional: col.notnull === 0,
      description: null, // SQLite has no column comments
      order: col.cid,
      relation: fkMap.get(`${table}.${col.name}`) ?? null,
      primary: col.pk === 1,
    }));
  }

  return Object.entries(tablesMap).map(([name, columns]) => ({
    name,
    columns,
  }));
};

import fs from "fs/promises";
import path from "path";

import type { Context } from "./context";
import { writeFile } from "./save";

export const updateRootRouter = async (context: Context) => {
  const rootFile = path.join("src", "server", "api", "root.ts");
  const file = await fs.readFile(rootFile, "utf8");

  const routerName = `${context.main.name.singular.camel}Router`;
  const routerImport = `import { ${routerName} } from "./routers/${context.main.name.singular.kebab}";`;

  const importRegex = /^import .+ from .+;$/gm;
  const routerBlockRegex = /createTRPCRouter\(\{([\s\S]*?)\}\)/m;

  const imports = file.match(importRegex) ?? [];
  const routersBlockMatch = routerBlockRegex.exec(file);

  if (!routersBlockMatch)
    throw new Error("Could not find createTRPCRouter block in root.ts");

  const routerBlock = routersBlockMatch[1]!.trim();

  let newImports = Array.from(new Set([...imports, routerImport]));
  newImports = [newImports[0]!, ...newImports.slice(1).sort()];

  const routerEntries = routerBlock
    .split(",")
    .map((r) => r.trim())
    .filter(Boolean);

  const newEntry = `${context.main.name.singular.camel}: ${routerName}`;
  const entryExists = routerEntries.some((r) =>
    r.startsWith(`${context.main.name.singular.camel}:`),
  );

  if (!entryExists) {
    routerEntries.push(newEntry);
  }

  const sortedEntries = routerEntries.sort((a, b) => a.localeCompare(b));

  const beforeImports = file.split(importRegex)[0] ?? "";
  const afterRouters = file.split(routerBlockRegex)[2] ?? "";

  const updatedFile =
    `${beforeImports}${newImports.join("\n")}\n\n` +
    `export const appRouter = createTRPCRouter({\n  ${sortedEntries.join(",\n  ")}\n})` +
    afterRouters.trimStart();

  await writeFile(rootFile, updatedFile);
};

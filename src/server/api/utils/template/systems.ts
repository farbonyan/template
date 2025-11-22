import fs from "fs/promises";
import path from "path";
import Mustache from "mustache";

import type { Context } from "./context";
import { writeFile } from "./save";

export const updateSystems = async (context: Context) => {
  const systemFile = path.join("src", "contexts", "systems", "systems.tsx");
  let file = await fs.readFile(systemFile, "utf8");

  const iconRegex = /(import\s+\{)([\s\S]*?)(\}\s+from\s+"lucide-react";)/m;
  const iconMatch = iconRegex.exec(file);

  if (iconMatch) {
    const iconName = context.icon.replace(/\(\) =>\s*/g, "").trim() + "Icon";

    if (!iconMatch[2]!.includes(iconName)) {
      file =
        file.slice(0, iconMatch.index) +
        iconMatch[1] +
        iconMatch[2]!.trimEnd().replace(/,?\s*$/, ", ") +
        `${iconName}\n` +
        file.slice(
          iconMatch.index + iconMatch[0].length - iconMatch[3]!.length,
        );
    }
  } else {
    console.warn("⚠️ Could not find lucide-react import block to add icon.");
  }

  const newMenu = Mustache.render(
    `
          {
            label: t("pages.{{main.name.plural.kebab}}.title"),
            icon: {{icon}}Icon,
            permitted: true,
            link: ["{{main.name.plural.camel}}.list", undefined] satisfies SystemLink,
          },
    `,
    context,
  );

  const insertRegex =
    /(title:\s*"NEW SYSTEMS",\s*icon:\s*SettingsIcon,\s*expandable:\s*true,[\s\S]*?menus:\s*\[)([\s\S]*?)(\],)/m;
  const match = insertRegex.exec(file);

  if (match?.index !== undefined) {
    const insertPos = match.index + match[1]!.length + match[2]!.length;
    file = file.slice(0, insertPos) + newMenu + file.slice(insertPos);
  } else {
    throw new Error("❌ Could not find the system block to insert new menu.");
  }

  await writeFile(systemFile, file);
};

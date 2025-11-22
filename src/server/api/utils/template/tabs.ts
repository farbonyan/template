import fs from "fs/promises";
import path from "path";
import Mustache from "mustache";

import type { Context } from "./context";
import { writeFile } from "./save";

export const updateTabPages = async (context: Context) => {
  const tabFile = path.join("src", "contexts", "tab-manager", "tab-pages.tsx");
  let file = await fs.readFile(tabFile, "utf8");

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

  const newImports = Mustache.render(
    `
import { {{main.name.singular.pascal}}Tab, {{main.name.singular.camel}}TabProps } from "~/tabs/{{main.name.plural.kebab}}/{{main.name.singular.kebab}}-tab";
import { {{main.name.plural.pascal}}Tab } from "~/tabs/{{main.name.plural.kebab}}/{{main.name.plural.kebab}}-tab";
`,
    context,
  );

  const importRegex =
    /(import\s+\{[^}]+\}\s+from\s+"~\/tabs\/[^\n]+";)(?![\s\S]*import\s+\{[^}]+\}\s+from\s+"~\/tabs\/)/m;
  const match = importRegex.exec(file);

  if (match?.index !== undefined) {
    const insertPos = match.index + match[0].length;
    file = file.slice(0, insertPos) + "\n" + newImports + file.slice(insertPos);
  } else {
    console.warn("⚠️ Could not find tabs import section. Adding at top.");
    file = newImports + "\n" + file;
  }

  const newGroup = Mustache.render(
    `...createGroup("{{main.name.plural.camel}}", {
          list: createTab({
            params: z.undefined(),
            return: z.void(),
            icon: () => {{icon}}Icon,
            title: () => t("pages.{{main.name.plural.kebab}}.title"),
            component: () => <{{main.name.plural.pascal}}Tab />,
          }),
          single: createTab({
            params: {{main.name.singular.camel}}TabProps,
            return:
              {{#main.table.specialColumns.primary.isText}}
              z.string(),
              {{/main.table.specialColumns.primary.isText}}
              {{#main.table.specialColumns.primary.isNumber}}
              z.number(),
              {{/main.table.specialColumns.primary.isNumber}}
            icon: () => {{icon}}Icon,
            title: (params) => {
              if (params.{{main.name.singular.camel}}) {
                return t("pages.{{main.name.plural.kebab}}.single.update-title", {
                  name: params.{{main.name.singular.camel}}.name,
                });
              }
              return t("pages.{{main.name.plural.kebab}}.single.create-title");
            },
            component: (params) => <{{main.name.singular.pascal}}Tab {...params} />,
          }),
        }),
`,
    context,
  );

  const token = "}) as const,";
  const lastIndex = file.lastIndexOf(token);

  if (lastIndex !== -1) {
    file = file.slice(0, lastIndex) + newGroup + file.slice(lastIndex);
  } else {
    const fallbackRegex = /(\}\),\s*\)\s*as const,)/m;
    const match = fallbackRegex.exec(file);
    if (match?.index !== undefined) {
      file = file.slice(0, match.index) + newGroup + file.slice(match.index);
    } else {
      throw new Error(
        "Could not find insertion point in tab-pages.tsx (expected '}) as const,').",
      );
    }
  }

  await writeFile(tabFile, file);
};

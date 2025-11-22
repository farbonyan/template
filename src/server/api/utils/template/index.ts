import fs from "fs/promises";
import path from "path";
import Mustache from "mustache";

import type { TableSchema } from "../../schema/table";
import type { TemplateSchema } from "../../schema/template";
import type { Translation } from "./types";
import { TEMPLATE_DIR } from "./consts";
import { getContext } from "./context";
import { updateRootRouter } from "./router";
import { mkdir, writeFile } from "./save";
import { updateSystems } from "./systems";
import { updateTabPages } from "./tabs";

export const generateTemplate = async (
  tables: TableSchema[],
  template: TemplateSchema,
) => {
  const context = getContext({ tables, template });

  // Translations
  const translationsDir = path.join(TEMPLATE_DIR, "translations");
  const translationFiles = await fs.readdir(translationsDir);
  for (const file of translationFiles) {
    const templatePath = path.join(translationsDir, file);
    const templateSrc = await fs.readFile(templatePath, "utf8");
    const rendered = JSON.parse(
      Mustache.render(templateSrc, context),
    ) as Translation;
    const outputName = Mustache.render(file, context).replace(
      /\.mustache$/,
      "",
    );
    const outputPath = path.join("messages", outputName);
    const lang = JSON.parse(
      await fs.readFile(outputPath, "utf8"),
    ) as Translation;
    const newLang = Object.entries(rendered).reduce((pre, [key, values]) => {
      return {
        ...pre,
        [key]:
          typeof lang[key] === "string" || typeof values === "string"
            ? values
            : { ...lang[key], ...values },
      };
    }, lang);
    await writeFile(outputPath, JSON.stringify(newLang, null, 2) + "\n");
  }

  // Api
  const apisDir = path.join(TEMPLATE_DIR, "api");
  const apisOutputDir = path.join("src", "server", "api", "routers");
  const apiFiles = await fs.readdir(apisDir);
  for (const file of apiFiles) {
    const templatePath = path.join(apisDir, file);
    const templateSrc = await fs.readFile(templatePath, "utf8");
    const rendered = Mustache.render(templateSrc, context);
    const outputName = Mustache.render(file, context).replace(
      /\.mustache$/,
      "",
    );
    const outputPath = path.join(apisOutputDir, outputName);
    await writeFile(outputPath, rendered);
  }
  await updateRootRouter(context);

  // Tabs
  const tabsDir = path.join(TEMPLATE_DIR, "tabs");
  const tabsOutputDir = path.join(
    "src",
    "tabs",
    context.main.name.plural.kebab,
  );
  await mkdir(tabsOutputDir);
  const tabFiles = await fs.readdir(tabsDir);
  for (const file of tabFiles) {
    const templatePath = path.join(tabsDir, file);
    const templateSrc = await fs.readFile(templatePath, "utf8");
    const rendered = Mustache.render(templateSrc, context);
    const outputName = Mustache.render(file, context).replace(
      /\.mustache$/,
      "",
    );
    const outputPath = path.join(tabsOutputDir, outputName);
    await writeFile(outputPath, rendered);
  }

  // Tab Pages
  await updateTabPages(context);

  // Systems
  await updateSystems(context);

  // Forms
  const formsDir = path.join(TEMPLATE_DIR, "forms");
  const formsOutputDir = path.join("src", "components", "forms");
  const formFiles = await fs.readdir(formsDir);
  for (const file of formFiles) {
    const templatePath = path.join(formsDir, file);
    const templateSrc = await fs.readFile(templatePath, "utf8");
    const rendered = Mustache.render(templateSrc, context);
    const outputName = Mustache.render(file, context).replace(
      /\.mustache$/,
      "",
    );
    const outputPath = path.join(formsOutputDir, outputName);
    await writeFile(outputPath, rendered);
  }
};

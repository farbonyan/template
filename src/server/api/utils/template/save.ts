import fs from "fs/promises";
import prettier from "prettier";

export const mkdir = async (folder: string) => {
  return await fs.mkdir(folder);
};

export const writeFile = async (filepath: string, content: string) => {
  const config = await prettier.resolveConfig(process.cwd());
  const formatted = await prettier.format(content, { ...config, filepath });
  return await fs.writeFile(filepath, formatted, "utf8");
};

import * as fs from "fs";
import * as path from "path";

type JsonObject = { [key: string]: string | JsonObject };

function flattenJson(obj: JsonObject, prefix = ""): Record<string, string> {
  const flat: Record<string, string> = {};
  for (const key in obj) {
    if (typeof obj[key] === "object") {
      Object.assign(flat, flattenJson(obj[key], `${prefix}${key}.`));
    } else {
      flat[`${prefix}${key}`] = obj[key] ?? key;
    }
  }
  return flat;
}

function unflattenJson(flatObj: Record<string, string>): JsonObject {
  const result: JsonObject = {};
  for (const [flatKey, value] of Object.entries(flatObj)) {
    const keys = flatKey.split(".");
    let acc: JsonObject | string = result;
    keys.forEach((key, i) => {
      if (typeof acc === "object") {
        if (i === keys.length - 1) {
          acc[key] = value;
        } else {
          acc[key] = acc[key] ?? {};
        }
        acc = acc[key];
      }
    });
  }
  return result;
}

// Folder where translations are stored
const messagesDir = path.resolve("messages");

// Get all .json files
const files = fs
  .readdirSync(messagesDir)
  .filter((file) => file.endsWith(".json"));

// Parse and flatten each translation file
const flatTranslations: Record<string, Record<string, string>> = {};
for (const file of files) {
  const filePath = path.join(messagesDir, file);
  const data = JSON.parse(fs.readFileSync(filePath, "utf8")) as JsonObject;
  flatTranslations[file] = flattenJson(data);
}

// Find common keys across all languages
const allKeys = Object.values(flatTranslations).map(
  (obj) => new Set(Object.keys(obj)),
);

const commonKeys = [
  ...allKeys.reduce((a, b) => {
    const intersection = new Set<string>();
    for (const key of b) {
      if (a.has(key)) intersection.add(key);
    }
    return intersection;
  }),
];

// Create new cleaned translation objects with only common keys
for (const [file, flatObj] of Object.entries(flatTranslations)) {
  const cleanedFlat: Record<string, string> = {};
  for (const key of commonKeys) {
    cleanedFlat[key] = flatObj[key] ?? key;
  }
  const cleaned = unflattenJson(cleanedFlat);
  const filePath = path.join(messagesDir, file);
  fs.writeFileSync(filePath, JSON.stringify(cleaned, null, 2) + "\n", "utf8");
  console.info(`✅ ${file} cleaned: only common keys kept.`);
}

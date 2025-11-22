import {
  camelCase,
  capitalCase,
  kebabCase,
  noCase,
  pascalCase,
} from "change-case";

export const getCases = (name: string) => {
  return {
    original: name,
    camel: camelCase(name),
    pascal: pascalCase(name),
    kebab: kebabCase(name),
    title: capitalCase(name),
    nocase: noCase(name),
  };
};

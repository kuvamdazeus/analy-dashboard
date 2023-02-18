import { validate } from "uuid";

export const isDynamicPath = (path: string) => {
  return validate(path) || /^[0-9]+$/.test(path) || /^[0-9A-Fa-f]+$/.test(path);
};

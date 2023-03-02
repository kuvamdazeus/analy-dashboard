import type { Duration } from "@/types";
import { validate } from "uuid";

export const isDynamicPath = (path: string) => {
  return validate(path) || /^[0-9]+$/.test(path) || /^[0-9A-Fa-f]+$/.test(path);
};

export const getGte = (duration: Duration) => {
  switch (duration) {
    case "1d":
      return new Date(Date.now() - 1 * 24 * 60 * 60 * 1000);
    case "7d":
      return new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    case "1m":
      return new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    case "3m":
      return new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
    case "1y":
      return new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);
    case "5y":
      return new Date(Date.now() - 5 * 365 * 24 * 60 * 60 * 1000);
    case "all":
      return new Date(0);
  }
};

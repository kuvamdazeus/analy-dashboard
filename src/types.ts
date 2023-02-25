import { z } from "zod";

export const durationSchema = z.enum([
  "1d",
  "7d",
  "1m",
  "3m",
  "1y",
  "5y",
  "all",
]);

export const requestDatatypeSchema = z.enum([
  "referrer",
  "country",
  "summary",
  "pages",
  "chart",
  "realtime",
]);

export const storageUserSchema = z.object({
  username: z.string(),
  name: z.string(),
  avatar_url: z.string(),
});

export type Duration = z.infer<typeof durationSchema>;
export type RequestDataType = z.infer<typeof requestDatatypeSchema>;
export type StorageUser = z.infer<typeof storageUserSchema>;
export type RedisKey = `${string}:${
  | "summary"
  | "pages"
  | "chart"
  | "realtime"}`;

import { Duration } from "./types";

export const DURATIONS: { label: string; value: Duration }[] = [
  { label: "Last 24 hours", value: "1d" },
  { label: "Last week", value: "7d" },
  { label: "Last month", value: "1m" },
  { label: "Last 3 months", value: "3m" },
  { label: "Last year", value: "1y" },
  { label: "Last 5 years", value: "5y" },
  { label: "All time", value: "all" },
];

export const REDIRECT_URI =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000/api/callback"
    : "https://analy-dashboard.vercel.app/api/callback";

export const GITHUB_OAUTH_URI = (state = "") =>
  `https://github.com/login/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_GH_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=read:user,user:email&state=${state}`;

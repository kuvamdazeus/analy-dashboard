import { createTRPCRouter } from "../trpc";
import { getSummaryData } from "../controllers/summary";
import { getPagesSummaryData } from "../controllers/pages";
import { getCountryData, getReferrerData } from "../controllers/sources";
import { getRealtimeData } from "../controllers/realtime";
import { getChartData } from "../controllers/historicalChart";
import {
  createProject,
  makeProjectPublic,
  updateProject,
} from "../controllers/projects";
import { getFeedbackData } from "../controllers/feedback";

export const dashboardRouter = createTRPCRouter({
  getSummaryData,
  getPagesSummaryData,
  getReferrerData,
  getCountryData,
  getRealtimeData,
  getChartData,
  makeProjectPublic,
  createProject,
  updateProject,
  getFeedbackData,
});

import { publishFeedback } from "../controllers/feedback";
import { createTRPCRouter } from "../trpc";

export const feedbackRouter = createTRPCRouter({
  publishFeedback,
});

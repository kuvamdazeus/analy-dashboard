import { getGte } from "@/server/utils/helpers";
import { durationSchema } from "@/types";
import { z } from "zod";
import protectedPublicRead from "../procedures/protectedPublicRead";

export const getFeedbackData = protectedPublicRead
  .input(
    z.object({
      duration: durationSchema,
      projectId: z.string().min(1),
      // filters: ...
      pageNumber: z.number().min(0).default(0).describe("Pagination offset"),
    })
  )
  .query(async ({ ctx, input: { projectId, duration, pageNumber } }) => {
    const offset = pageNumber * 25;

    const [feedbackData, totalRows] = await Promise.all([
      ctx.prisma.feedback.findMany({
        where: {
          session: {
            project: {
              id: projectId,
            },
          },
          created_at: {
            gte: getGte(duration),
          },
        },
        orderBy: {
          created_at: "desc",
        },
        skip: offset,
        take: 25,
      }),

      ctx.prisma.feedback.count({
        where: {
          session: {
            project: {
              id: projectId,
            },
          },
        },
      }),
    ]);

    return { feedbackData, totalPages: Math.ceil(totalRows / 25) };
  });

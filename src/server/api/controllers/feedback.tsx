import { getGte } from "@/server/utils/helpers";
import { durationSchema } from "@/types";
import { z } from "zod";
import protectedPublicRead from "../procedures/protectedPublicRead";
import { publicProcedure } from "../trpc";

export const getFeedbackData = protectedPublicRead
  .input(
    z.object({
      duration: durationSchema,
      projectId: z.string().min(1),
      filter: z.enum(["positive", "negative", "all"]).default("all"),
      pageNumber: z.number().min(0).default(0).describe("Pagination offset"),
    })
  )
  .query(
    async ({ ctx, input: { projectId, duration, pageNumber, filter } }) => {
      const offset = pageNumber * 25;
      const filters: any = {};

      if (filter === "positive") {
        filters.gt = 0;
      }

      if (filter === "negative") {
        filters.lte = 0;
      }

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
            rating: {
              ...filters,
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
    }
  );

export const publishFeedback = publicProcedure
  .input(
    z.object({
      session_id: z.string().min(1),
      rating: z.number().min(-1).max(1).int(),
      neediness: z
        .number()
        .min(-2)
        .max(2)
        .int()
        .refine((n) => n !== 0, {
          message: "'neediness' must be -2, -1, 1, or 2",
        }),
      recommended: z
        .number()
        .min(-2)
        .max(2)
        .int()
        .refine((n) => n !== 0, {
          message: "'recommended' must be -2, -1, 1, or 2",
        }),
      positive_comment: z.string().min(0).max(1000),
      negative_comment: z.string().min(0).max(1000),
    })
  )
  .mutation(async ({ ctx, input }) => {
    await ctx.prisma.feedback.create({
      data: {
        session_id: input.session_id,
        rating: input.rating,
        neediness: input.neediness,
        recommended: input.recommended,
        positive_comment: input.positive_comment,
        negative_comment: input.negative_comment,
      },
    });

    return null;
  });
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const feedbackRouter = createTRPCRouter({
  publishFeedback: publicProcedure
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
    }),
});

import { durationSchema } from "@/types";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { publicProcedure } from "../trpc";

const protectedPublicRead = publicProcedure
  .input(
    z.object({
      projectId: z.string().min(1),
      duration: z.optional(durationSchema),
    })
  )
  .use(async ({ ctx, next, input }) => {
    const project = await ctx.prisma.project.findUniqueOrThrow({
      where: { id: input.projectId },
      include: { user: true },
    });

    if (project.user.id !== ctx.userId && !project.is_public) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    return next();
  });

export default protectedPublicRead;

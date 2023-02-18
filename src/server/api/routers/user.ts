import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { z } from "zod";

export const userRouter = createTRPCRouter({
  getUser: protectedProcedure.query(async ({ ctx }) => {
    console.log("ctx.userId", ctx.userId);

    const user = await ctx.prisma.user.findUniqueOrThrow({
      where: { id: ctx.userId },
      include: { projects: true },
    });

    return user;
  }),
});

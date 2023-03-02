import { z } from "zod";
import protectedPublicRead from "../procedures/protectedPublicRead";

export const getRealtimeData = protectedPublicRead
  .input(
    z.object({
      projectId: z.string(),
    })
  )
  .query(async ({ ctx, input: { projectId } }) => {
    const realtimeData = await ctx.prisma.event.findMany({
      where: {
        session: {
          project: {
            id: projectId,
          },
        },
        created_at: {
          gte: new Date(Date.now() - 60 * 60 * 1000),
        },
      },
      orderBy: {
        created_at: "asc",
      },
    });

    return realtimeData;
  });

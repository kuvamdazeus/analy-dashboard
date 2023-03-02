import { z } from "zod";
import protectedPublicRead from "../procedures/protectedPublicRead";

export const getPagesSummaryData = protectedPublicRead
  .input(
    z.object({
      projectId: z.string(),
    })
  )
  .query(async ({ ctx, input: { projectId } }) => {
    const pagesSummaryData = await ctx.prisma.event.groupBy({
      where: {
        session: {
          project: {
            id: projectId,
          },
        },
      },
      by: ["parsed_url"],
      _count: {
        _all: true,
      },
    });

    return pagesSummaryData;
  });

import { getGte } from "@/server/utils/helpers";
import { durationSchema } from "@/types";
import { z } from "zod";
import protectedPublicRead from "../procedures/protectedPublicRead";

export const getSummaryData = protectedPublicRead
  .input(
    z.object({
      projectId: z.string(),
      duration: durationSchema,
    })
  )
  .query(async ({ ctx, input: { projectId, duration } }) => {
    const [uniquePageVisits, pageViews, sessions] = await Promise.all([
      ctx.prisma.event.count({
        where: {
          session: {
            project: {
              id: projectId,
            },
          },
          name: "user_init",
          created_at: {
            gte: getGte(duration),
          },
        },
      }),
      ctx.prisma.event.count({
        where: {
          session: {
            project: {
              id: projectId,
            },
          },
          name: "page_load",
          created_at: {
            gte: getGte(duration),
          },
        },
      }),
      ctx.prisma.session.findMany({
        where: {
          project: {
            id: projectId,
          },
          created_at: {
            gte: getGte(duration),
          },
        },
        include: {
          events: {
            select: {
              created_at: true,
            },
          },
        },
      }),
    ]);

    const sessionsCount = sessions.length;

    let avgSessionsDuration = 0;

    for (let session of sessions) {
      const dates: Date[] = [];

      for (const event of session.events) {
        dates.push(event.created_at);
      }

      dates.sort((a, b) => a.getTime() - b.getTime());

      const sessionDuration = dates.length
        ? (dates.at(-1) as Date).getTime() - (dates.at(0) as Date).getTime()
        : 0;
      avgSessionsDuration += sessionDuration;
    }
    avgSessionsDuration = avgSessionsDuration / sessionsCount;
    avgSessionsDuration = avgSessionsDuration / 1000;

    return {
      uniquePageVisits,
      pageViews,
      sessionsCount,
      avgSessionsDuration,
    };
  });

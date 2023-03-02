import { getGte } from "@/server/utils/helpers";
import { durationSchema } from "@/types";
import { z } from "zod";
import protectedPublicRead from "../procedures/protectedPublicRead";

export const getChartData = protectedPublicRead
  .input(
    z.object({
      projectId: z.string(),
      duration: durationSchema,
    })
  )
  .query(async ({ ctx, input: { projectId, duration } }) => {
    const [pageViewsChartData, uniqueVisitsChartData, groupedSessionData] =
      await Promise.all([
        ctx.prisma.event.groupBy({
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
          by: ["date"],
          orderBy: {
            date: "asc",
          },
          _count: {
            _all: true,
          },
        }),
        ctx.prisma.event.groupBy({
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
          by: ["date"],
          orderBy: {
            date: "asc",
          },
          _count: {
            _all: true,
          },
        }),
        ctx.prisma.event.groupBy({
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
          by: ["date", "session_id"],
          orderBy: {
            date: "asc",
          },
          _count: {
            _all: true,
          },
        }),
      ]);

    const sessionData = new Map<string, { _count: { _all: number } }>();
    for (let session of groupedSessionData) {
      const sessionCount = sessionData.get(session.date);

      if (sessionCount) {
        sessionData.set(session.date, {
          _count: { _all: sessionCount._count._all + 1 },
        });
      } else {
        sessionData.set(session.date, { _count: { _all: 1 } });
      }
    }

    const sessionChartData = Array.from(sessionData).map(([date, data]) => ({
      date,
      ...data,
    }));

    return { pageViewsChartData, uniqueVisitsChartData, sessionChartData };
  });

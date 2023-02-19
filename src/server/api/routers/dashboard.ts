import { createTRPCRouter, publicProcedure, t } from "../trpc";
import { z } from "zod";
import { Duration, durationSchema } from "@/types";
import { TRPCError } from "@trpc/server";

const getGte = (duration: Duration) => {
  switch (duration) {
    case "1d":
      return new Date(Date.now() - 1 * 24 * 60 * 60 * 1000);
    case "7d":
      return new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    case "1m":
      return new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    case "3m":
      return new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
    case "1y":
      return new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);
    case "5y":
      return new Date(Date.now() - 5 * 365 * 24 * 60 * 60 * 1000);
    case "all":
      return new Date(0);
  }
};

const dashboardProcedure = publicProcedure
  .input(
    z.object({ projectId: z.string(), duration: z.optional(durationSchema) })
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

export const dashboardRouter = createTRPCRouter({
  getSummaryData: dashboardProcedure
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
        let dates: Date[] = [];

        for (let event of session.events) {
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
    }),
  getPagesSummaryData: dashboardProcedure
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
    }),
  getReferrerData: dashboardProcedure
    .input(
      z.object({
        projectId: z.string(),
      })
    )
    .query(async ({ ctx, input: { projectId } }) => {
      const referrerData = await ctx.prisma.event.groupBy({
        where: {
          session: {
            project: {
              id: projectId,
            },
          },
          referrer: {
            not: "",
          },
        },
        by: ["referrer"],
        _count: {
          _all: true,
        },
      });

      return referrerData;
    }),
  getCountryData: dashboardProcedure
    .input(
      z.object({
        projectId: z.string(),
      })
    )
    .query(async ({ ctx, input: { projectId } }) => {
      const countryData = await ctx.prisma.event.groupBy({
        where: {
          session: {
            project: {
              id: projectId,
            },
          },
          country: {
            not: "",
          },
        },
        by: ["country"],
        _count: {
          _all: true,
        },
      });

      return countryData;
    }),
  getRealtimeData: dashboardProcedure
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
    }),
  getChartData: dashboardProcedure
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
    }),
  makeProjectPublic: dashboardProcedure
    .input(z.object({ projectId: z.string(), isPublic: z.boolean() }))
    .mutation(async ({ ctx, input: { projectId, isPublic } }) => {
      await ctx.prisma.project.update({
        where: {
          id: projectId,
        },
        data: {
          is_public: isPublic,
        },
      });

      return null;
    }),
});

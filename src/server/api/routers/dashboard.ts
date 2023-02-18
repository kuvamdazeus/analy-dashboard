import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { z } from "zod";
import { Duration, durationSchema, requestDatatypeSchema } from "@/types";

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

export const dashboardRouter = createTRPCRouter({
  getSummaryData: protectedProcedure
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
  getPagesSummaryData: protectedProcedure
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
  getReferrerData: protectedProcedure
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
  getCountryData: protectedProcedure
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
  getRealtimeData: protectedProcedure
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
});

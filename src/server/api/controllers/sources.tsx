import { z } from "zod";
import protectedPublicRead from "../procedures/protectedPublicRead";

export const getReferrerData = protectedPublicRead
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
  });

export const getCountryData = protectedPublicRead
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
  });

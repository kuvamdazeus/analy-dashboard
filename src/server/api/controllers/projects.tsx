import SHA256 from "crypto-js/sha256";
import { z } from "zod";
import protectedPublicRead from "../procedures/protectedPublicRead";
import { protectedProcedure } from "../trpc";

export const makeProjectPublic = protectedPublicRead
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
  });

export const createProject = protectedProcedure
  .input(z.object({ name: z.string(), url: z.string() }))
  .mutation(async ({ ctx, input: { name, url } }) => {
    const { id: projectId } = await ctx.prisma.project.create({
      data: {
        name,
        url,
        key: SHA256((Date.now() + Math.random()).toString()).toString(),
        user_id: ctx.userId as string,
      },
    });

    return projectId;
  });

export const updateProject = protectedProcedure
  .input(
    z.object({
      projectId: z.string().min(1),
      name: z.string().min(1),
      url: z.string().min(1),
    })
  )
  .mutation(async ({ ctx, input: { projectId, name, url } }) => {
    const { projects } = await ctx.prisma.user.update({
      where: {
        id: ctx.userId as string,
      },
      select: {
        projects: {
          where: {
            id: projectId,
          },
        },
      },
      data: {
        projects: {
          update: {
            where: {
              id: projectId,
            },
            data: {
              name,
              url,
            },
          },
        },
      },
    });

    return projects.pop();
  });

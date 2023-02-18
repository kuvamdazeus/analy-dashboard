import { prisma } from "@/server/db";
import { isDynamicPath } from "@/server/utils/helpers";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { session, event } = req.body;

  if (!session || !event || !session.project_key)
    return res.status(400).json({ message: "Bad Request" });

  const windowUrl = new URL(event.window_url);
  let parsedUrl = windowUrl.origin;
  windowUrl.pathname.split("/").forEach((path) => {
    if (path) parsedUrl += isDynamicPath(path) ? "/[...]" : `/${path}`;
  });

  await prisma.session.upsert({
    where: {
      id: session.id,
    },
    create: session,
    update: {},
  });

  await prisma.event.create({
    data: { ...event, parsed_url: parsedUrl },
  });

  return res.status(200).json({ message: "OK" });
}

import { prisma } from "@/server/db";
import { userCookie } from "@/server/utils/cookies";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const { code, state } = request.query;

  if (!code) return response.redirect("/");

  const { access_token } = await fetch(
    "https://github.com/login/oauth/access_token",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        client_id: process.env.NEXT_PUBLIC_GH_CLIENT_ID,
        client_secret: process.env.GH_CLIENT_SECRET,
        code,
      }),
    }
  ).then((res) => res.json());

  // get github user data from the access token
  const { login, avatar_url, email, name } = await fetch(
    "https://api.github.com/user",
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    }
  ).then((res) => res.json());

  try {
    const { id } = await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        username: login,
        email,
        name,
        avatar_url,
      },
    });
  } catch (err) {
    return response.send(err);
  }

  // userCookie.set(id, response);

  // if (state) return response.redirect(state as string);
  // return response.redirect("/?redirect=dashboard");
}

import cookie from "cookie";
import type { NextApiRequest, NextApiResponse } from "next";

export const userCookie = {
  get: (req: NextApiRequest) => {
    const { user } = cookie.parse(req.headers.cookie || "");
    return user;
  },
  set: (user: string, res: NextApiResponse) => {
    res.setHeader(
      "Set-Cookie",
      cookie.serialize("user", user, {
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      })
    );
  },
};

import { useEffect } from "react";
import { useRouter } from "next/router";
import { GITHUB_OAUTH_URI } from "@/constants";
import type { GetServerSideProps, NextApiRequest } from "next";
import { userCookie } from "@/server/utils/cookies";

interface Props {
  loggedIn: boolean;
}

export default function Index({ loggedIn }: Props) {
  const router = useRouter();

  const isRedirect = !!router.query.redirect;
  const canRedirect = loggedIn;

  useEffect(() => {
    if (isRedirect) {
      router.replace("/dashboard");
    }
  }, [isRedirect]);

  return (
    <section className="flex h-screen flex-col items-center justify-center">
      <p className="mb-5 text-3xl font-bold">Analy Dashboard</p>

      <a
        href={canRedirect ? "/dashboard" : GITHUB_OAUTH_URI()}
        className="rounded bg-gray-600 px-12 py-2 text-lg text-white"
      >
        Login with Github
      </a>
    </section>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const userId = userCookie.get(req as NextApiRequest);

  return {
    props: {
      loggedIn: userId || null, // apparently undefined cant be serialized to JSON, but null can be, FUCK JS!
    },
  };
};

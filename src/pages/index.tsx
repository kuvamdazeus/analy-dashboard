import { useEffect } from "react";
import { GITHUB_OAUTH_URI } from "@/constants";
import { useRouter } from "next/router";
import useUserStore from "@/state/user";
import { api } from "@/utils/api";

export default function Index() {
  const router = useRouter();

  const isRedirect = !!router.query.redirect;

  useEffect(() => {
    if (isRedirect) {
      router.replace("/dashboard");
    }
  }, [isRedirect]);

  return (
    <div>
      <p className="text-3xl">Landing page</p>

      <a href={GITHUB_OAUTH_URI()} className="m-5 border border-red-500">
        Login with Github
      </a>
    </div>
  );
}

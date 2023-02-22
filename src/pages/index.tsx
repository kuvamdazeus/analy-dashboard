import { useEffect } from "react";
import { useRouter } from "next/router";
import { GITHUB_OAUTH_URI } from "@/constants";
import { useCookies } from "react-cookie";

export default function Index() {
  const [cookies] = useCookies(["user"]);

  const router = useRouter();

  const isRedirect = !!router.query.redirect;
  const canRedirect = !!cookies.user;

  useEffect(() => {
    if (isRedirect) {
      router.replace("/dashboard");
    }
  }, [isRedirect]);

  return (
    <div className="">
      <p className="text-3xl">Landing page</p>

      <a
        href={canRedirect ? "/dashboard" : GITHUB_OAUTH_URI()}
        className="m-5 border border-red-500"
      >
        Login with Github
      </a>
    </div>
  );
}

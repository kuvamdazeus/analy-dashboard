import { GITHUB_OAUTH_URI } from "@/constants";
import { StorageUser } from "@/types";
import { api } from "@/utils/api";
import { getJsonStorageData } from "@/utils/misc";
import { Button, useColorMode } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { FiMoon, FiSun } from "react-icons/fi";
import NavProject from "./NavProject";

export default function Navbar() {
  const { colorMode, toggleColorMode } = useColorMode();
  const router = useRouter();
  const user = api.user.getUser.useQuery(undefined, {
    refetchOnWindowFocus: false,
    onSuccess: (data) => {
      localStorage.setItem(
        "user_cache",
        JSON.stringify({
          name: data.name,
          username: data.username,
          avatar_url: data.avatar_url,
        } as StorageUser)
      );
    },
  });

  const displayProjectName = /dashboard\/.+\-.+\-.+/.test(router.asPath);
  const projectId = ((router.query.pid as string) || "").split("/").at(-1);

  const storageUser = getJsonStorageData("user_cache") as
    | StorageUser
    | undefined;
  const userData = user.data || storageUser;

  return (
    <nav className="flex items-center justify-between border-b border-dashed border-gray-400 bg-white px-5 py-5 dark:border-gray-500 dark:bg-gray-900">
      {displayProjectName &&
      user.data?.projects.filter((project) => project.id === projectId)
        .length ? (
        <NavProject />
      ) : (
        <div />
      )}

      <div className="flex items-center">
        {userData && (
          <div className="flex items-center">
            <div className="-mr-2.5 rounded border border-gray-100 bg-gray-50 p-1 pr-3 dark:border-gray-700 dark:bg-gray-800">
              <p className="text-sm font-bold">
                <span className="text-md mr-0.5 font-bold text-gray-500">
                  @
                </span>
                {userData.username}
              </p>
            </div>

            <img
              src={userData.avatar_url}
              className="h-12 w-12 rounded-full border-2 object-contain dark:border-gray-500"
            />
          </div>
        )}

        {!userData && (
          <Button
            bg="purple.500"
            w="24"
            className="font-bold text-white"
            onClick={() =>
              (window.location.href = GITHUB_OAUTH_URI(window.location.href))
            }
          >
            Sign in
          </Button>
        )}

        <div
          onClick={toggleColorMode}
          className="ml-3 cursor-pointer rounded-full bg-gray-50 p-2 text-xl transition-all duration-300 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700"
        >
          {colorMode === "light" ? (
            <FiSun className="" />
          ) : (
            <FiMoon className="" />
          )}
        </div>
      </div>
    </nav>
  );
}

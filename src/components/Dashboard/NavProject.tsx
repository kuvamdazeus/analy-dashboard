import { useState } from "react";
import { useRouter } from "next/router";
import { api } from "@/utils/api";

export default function NavProject() {
  const router = useRouter();

  const user = api.user.getUser.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });

  const currentProject = user.data?.projects.find(
    (project) => project.id === location.pathname.split("/").at(-1)
  );

  const [isPublic, setIsPublic] = useState<boolean | undefined>(
    currentProject?.is_public
  );
  const [showCopiedText, setShowCopiedText] = useState(false);

  const isUnsafe = !user.data?.id;

  return (
    <div className="flex items-center">
      <select
        defaultValue={currentProject?.id}
        onChange={(e) => router.push(`/dashboard/${e.target.value}`)}
        className="min-w-32 mr-1 rounded border border-gray-500 p-1 font-semibold focus:outline-none dark:bg-transparent"
      >
        {user.data?.projects.map((project) => (
          <option key={project.id} value={project.id}>
            {project.name}
          </option>
        ))}
      </select>
    </div>
  );
}

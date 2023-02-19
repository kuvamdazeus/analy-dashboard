import { useState } from "react";
import { useRouter } from "next/router";
import { api } from "@/utils/api";
import { Badge, Tooltip } from "@chakra-ui/react";
import { FiCopy } from "react-icons/fi";

export default function NavProject() {
  const router = useRouter();

  const user = api.user.getUser.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });

  const projectMutation = api.dashboard.makeProjectPublic.useMutation();

  const currentProject = user.data?.projects.find(
    (project) => project.id === location.pathname.split("/").at(-1)
  );

  const [isPublic, setIsPublic] = useState<boolean | undefined>(
    currentProject?.is_public
  );
  const [showCopiedText, setShowCopiedText] = useState(false);

  const isUnsafe = !user.data?.id;

  const makeProjectPublic = () => {
    projectMutation.mutate({
      projectId: currentProject?.id || "",
      isPublic: !isPublic,
    });

    setIsPublic(!isPublic);
  };

  return (
    <div className="flex items-center">
      <select
        defaultValue={currentProject?.id}
        onChange={(e) => router.push(`/dashboard/${e.target.value}`)}
        className="min-w-32 rounded border border-gray-500 p-1 font-semibold focus:outline-none dark:bg-transparent"
      >
        {user.data?.projects.map((project) => (
          <option key={project.id} value={project.id}>
            {project.name}
          </option>
        ))}
      </select>

      <Tooltip label={`Make ${isPublic ? "private" : "public"}`}>
        <Badge
          mx="2"
          colorScheme={isPublic ? "green" : "red"}
          cursor="pointer"
          onClick={isUnsafe ? () => {} : makeProjectPublic}
        >
          {isPublic ? "Public" : "Private"}
        </Badge>
      </Tooltip>

      <div
        className="flex cursor-pointer items-center gap-2 text-lg text-purple-500"
        onClick={
          isUnsafe
            ? () => {}
            : () => {
                setShowCopiedText(true);
                setTimeout(() => setShowCopiedText(false), 1000);
                navigator.clipboard.writeText(currentProject?.key || "");
              }
        }
      >
        <FiCopy />

        {showCopiedText && (
          <p className="text-xs font-light">COPIED API KEY!</p>
        )}
      </div>
    </div>
  );
}

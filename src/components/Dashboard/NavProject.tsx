import { useState } from "react";
import { useRouter } from "next/router";
import { api } from "@/utils/api";
import { Badge, Tooltip } from "@chakra-ui/react";
import { FiCopy, FiEdit, FiEdit2 } from "react-icons/fi";
import CreateProjectModal from "./CreateProjectModal";

export default function NavProject() {
  const router = useRouter();

  const user = api.user.getUser.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });

  const projectMutation = api.dashboard.makeProjectPublic.useMutation({
    onSuccess: () => user.refetch(),
  });

  const currentProject = user.data?.projects.find(
    (project) => project.id === location.pathname.split("/").at(-1)
  );

  const [showCopiedText, setShowCopiedText] = useState(false);
  const [edit, setEdit] = useState(false);

  const isUnsafe = !user.data?.id;

  const makeProjectPublic = () => {
    projectMutation.mutate({
      projectId: currentProject?.id || "",
      isPublic: !currentProject?.is_public,
    });
  };

  return (
    <>
      <CreateProjectModal open={edit} setOpen={setEdit} isEdit />

      <div className="flex items-center">
        <FiEdit
          onClick={() => setEdit(true)}
          className="mr-2 cursor-pointer text-xl text-orange-600"
        />

        <select
          defaultValue={currentProject?.id}
          onChange={(e) => router.push(`/dashboard/${e.target.value}`)}
          className="min-w-32 mr-2 rounded border border-gray-500 p-1  font-semibold focus:outline-none dark:bg-transparent"
        >
          {user.data?.projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>

        <Tooltip
          label={`Make ${currentProject?.is_public ? "private" : "public"}`}
        >
          <Badge
            mr="2"
            colorScheme={currentProject?.is_public ? "green" : "red"}
            cursor="pointer"
            onClick={isUnsafe ? () => {} : makeProjectPublic}
          >
            {currentProject?.is_public ? "Public" : "Private"}
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
    </>
  );
}

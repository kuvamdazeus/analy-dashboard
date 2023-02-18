import type { Project as ProjectType } from "@prisma/client";
import { useRouter } from "next/router";
import { FiExternalLink } from "react-icons/fi";

interface Props {
  project: ProjectType;
}

export default function Project({ project }: Props) {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(`/dashboard/${project.id}`)}
      className="
        relative flex h-48 w-72 cursor-pointer flex-col justify-end rounded-lg border-2 border-black bg-white p-5
        transition-all duration-100 hover:scale-[1.01] hover:shadow-lg dark:bg-gray-800
      "
    >
      <p className="text-xl font-light">{project.name}</p>

      <a
        className="absolute top-3 right-3 text-lg text-blue-500"
        target="_blank"
        href={`https://${project.url}`}
      >
        <FiExternalLink />
      </a>
    </div>
  );
}

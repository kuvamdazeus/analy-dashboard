import { useState } from "react";
import CreateProjectModal from "./CreateProjectModal";

export default function CreateProject() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <CreateProjectModal open={modalOpen} setOpen={setModalOpen} />

      <div
        onClick={() => setModalOpen(true)}
        className="
          flex h-48 w-72 cursor-pointer
          flex-col justify-end rounded-lg
          border-2 border-black bg-gradient-to-br from-slate-200 via-white to-slate-100 p-5 transition-all duration-300
          hover:translate-x-[-7px] hover:translate-y-[-7px] hover:shadow-[7px_7px_0px_0px_#252525]
          dark:from-slate-800
          dark:via-slate-900
          dark:to-slate-800 dark:hover:shadow-[7px_7px_0px_0px_#000000]
        "
      >
        <p className="font-semibold">Create a New Project</p>
      </div>
    </>
  );
}

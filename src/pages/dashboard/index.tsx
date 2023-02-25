import CreateProject from "@/components/Dashboard/CreateProject";
import Navbar from "@/components/Dashboard/Navbar";
import Project from "@/components/Dashboard/Project";
import { api } from "@/utils/api";
import Head from "next/head";

export default function Dashboard() {
  const user = api.user.getUser.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });

  return (
    <>
      <Head>
        <title>Analy | Dashboard</title>
      </Head>

      <Navbar />

      <section className={`p-5`}>
        <div className="flex flex-wrap items-center gap-5">
          {user.data?.projects.map((project) => (
            <Project key={project.id} project={project} />
          ))}
        </div>

        <div className="my-5 h-px w-full bg-gray-200 dark:bg-gray-700" />

        <CreateProject />
      </section>
    </>
  );
}

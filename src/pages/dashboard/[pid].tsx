import Navbar from "@/components/Dashboard/Navbar";
import Summary from "@/components/Dashboard/Summary";
import TopPages from "@/components/Dashboard/TopPages";
import TopSources from "@/components/Dashboard/TopSources";

export default function ProjectPage() {
  return (
    <>
      <Navbar />

      <section className={`bg-gray-100 p-5 dark:bg-gray-900`}>
        <div className="mb-5 flex h-64 gap-5">
          <Summary />

          <TopPages />

          <TopSources />
        </div>
      </section>
    </>
  );
}

import DashboardChart from "@/components/Dashboard/DashboardChart";
import Navbar from "@/components/Dashboard/Navbar";
import RealtimeStats from "@/components/Dashboard/RealtimeStats";
import Summary from "@/components/Dashboard/Summary";
import TopPages from "@/components/Dashboard/TopPages";
import TopSources from "@/components/Dashboard/TopSources";

export default function ProjectPage() {
  return (
    <>
      <Navbar />

      <section className={`bg-gray-100 p-5 dark:bg-gray-900 dark:text-white`}>
        <div className="mb-5 flex h-64 gap-5">
          <Summary />

          <TopPages />

          <TopSources />
        </div>

        <DashboardChart />

        <div className="my-5 flex gap-5">
          <RealtimeStats />
        </div>
      </section>
    </>
  );
}

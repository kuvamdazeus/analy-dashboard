import dynamic from "next/dynamic";

const Navbar = dynamic(() => import("@/components/Dashboard/Navbar"), {
  ssr: false,
});
const Summary = dynamic(() => import("@/components/Dashboard/Summary"), {
  ssr: false,
});
const TopPages = dynamic(() => import("@/components/Dashboard/TopPages"), {
  ssr: false,
});
const TopSources = dynamic(() => import("@/components/Dashboard/TopSources"), {
  ssr: false,
});
const DashboardChart = dynamic(
  () => import("@/components/Dashboard/DashboardChart"),
  { ssr: false }
);
const RealtimeStats = dynamic(
  () => import("@/components/Dashboard/RealtimeStats"),
  { ssr: false }
);

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

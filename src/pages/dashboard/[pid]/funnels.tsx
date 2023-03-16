import dynamic from "next/dynamic";
import Head from "next/head";

const Navbar = dynamic(() => import("@/components/Dashboard/Navbar"), {
  ssr: false,
});

export default function FunnelsPage() {
  return (
    <>
      <Head>
        <title>Analy | Funnels</title>
      </Head>

      <Navbar />

      <section className={`bg-gray-100 p-5 dark:bg-gray-900 dark:text-white`}>
        {/* Something */}
      </section>
    </>
  );
}

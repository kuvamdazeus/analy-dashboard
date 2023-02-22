import { api } from "@/utils/api";
import { Box, Skeleton } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useMemo } from "react";

export default function TopPages() {
  const router = useRouter();

  const projectId =
    ((router.query.pid as string) || "").split("/").at(-1) || "";

  const pageSummary = api.dashboard.getPagesSummaryData.useQuery(
    {
      projectId,
    },
    { refetchOnWindowFocus: false }
  );

  const correctedPageSummary = useMemo(() => {
    if (!pageSummary.data) return [];

    const pathnames = new Map<string, number>();

    for (const pageData of pageSummary.data) {
      const pathname = new URL(pageData.parsed_url).pathname;

      if (pathnames.has(pathname)) {
        pathnames.set(
          pathname,
          pathnames.get(pathname)! + pageData._count._all
        );
      } else {
        pathnames.set(pathname, pageData._count._all);
      }
    }

    return Array.from(pathnames.entries()).map(([pathname, count]) => ({
      pathname,
      _count: {
        _all: count,
      },
    }));
  }, [pageSummary.data]);

  const totalPageViews = pageSummary.data
    ? pageSummary.data.reduce((acc, pageData) => acc + pageData._count._all, 0)
    : 0;

  return (
    <Box
      border="1px"
      borderColor="gray.100"
      _dark={{ borderColor: "gray.700" }}
      className="h-full w-1/2 overflow-y-auto rounded-lg bg-white p-3 dark:bg-gray-800"
    >
      <p className="mb-5 text-xl font-bold">Top Pages</p>

      {pageSummary.isLoading && (
        <div>
          <Skeleton className="mb-2 h-7 w-5/6" />
          <Skeleton className="mb-2 h-7 w-1/2" />
          <Skeleton className="mb-2 h-7 w-1/3" />
        </div>
      )}

      {!pageSummary.isLoading &&
        pageSummary.data &&
        correctedPageSummary
          .sort((a, b) => b._count._all - a._count._all)
          .map((pageData) => {
            const pathname = pageData.pathname;
            const count = pageData._count._all;

            return (
              <Box key={pathname} className="relative mb-1 p-2">
                <Box
                  style={{ width: `${(count / totalPageViews) * 100}%` }}
                  className="absolute top-0 left-0 z-0 h-full bg-green-100 dark:bg-green-600"
                />

                <p className="sticky text-xs font-light tracking-wide text-gray-700 dark:text-white">
                  {pathname}
                </p>
              </Box>
            );
          })}
    </Box>
  );
}

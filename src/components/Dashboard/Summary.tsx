import { DURATIONS } from "@/constants";
import { Duration } from "@/types";
import { api } from "@/utils/api";
import { Select, Skeleton } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useState } from "react";

export default function Summary() {
  const router = useRouter();

  const [duration, setDuration] = useState<Duration>("1d");

  const projectId = router.asPath.split("/").at(-1) || "";

  const summary = api.dashboard.getSummaryData.useQuery(
    {
      projectId,
      duration,
    },
    { refetchOnWindowFocus: false }
  );

  const fetchSummaryData = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDuration(e.target.value as Duration);
  };

  return (
    <div className="h-full w-1/2 rounded-lg border border-gray-100 bg-white p-3 dark:border-gray-700 dark:bg-gray-800">
      <div className="mb-5 flex w-full items-center justify-between">
        <p className="mr-5 text-xl font-bold">Summary</p>

        <Select
          defaultValue="1d"
          onChange={fetchSummaryData}
          borderColor="gray.500"
          w="max-content"
          size="sm"
          rounded="md"
        >
          {DURATIONS.map(({ label, value }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Select>
      </div>

      {summary.isLoading ? (
        <div>
          <Skeleton height="20px" className="mb-3" />
          <Skeleton height="20px" className="mb-3" />
          <Skeleton height="20px" className="mb-3" />
          <Skeleton height="20px" className="mb-3" />
        </div>
      ) : (
        <>
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-bold tracking-wide text-gray-500 dark:text-gray-400">
              UNIQUE VISITS
            </p>

            <div className="flex items-center justify-between rounded-sm bg-gray-200 p-1 text-xs font-bold text-gray-800 dark:bg-gray-100">
              <p className="mr-3">
                {summary.data && summary.data.uniquePageVisits}
              </p>

              <p>-</p>
            </div>
          </div>

          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-bold tracking-wide text-gray-500 dark:text-gray-400">
              PAGE VIEWS
            </p>

            <div className="flex items-center justify-between rounded-sm bg-gray-200 p-1 text-xs font-bold text-gray-800 dark:bg-gray-100">
              <p className="mr-3">{summary.data && summary.data.pageViews}</p>

              <p>-</p>
            </div>
          </div>

          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-bold tracking-wide text-gray-500 dark:text-gray-400">
              SESSION COUNT
            </p>

            <div className="flex items-center justify-between rounded-sm bg-gray-200 p-1 text-xs font-bold text-gray-800 dark:bg-gray-100">
              <p className="mr-3">
                {summary.data && summary.data.sessionsCount}
              </p>

              <p>-</p>
            </div>
          </div>

          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-bold tracking-wide text-gray-500 dark:text-gray-400">
              AVG. SESSION TIME
            </p>

            <div className="flex items-center justify-between rounded-sm bg-gray-200 p-1 text-xs font-bold text-gray-800 dark:bg-gray-100">
              <p className="mr-3">
                {summary.data && Math.round(summary.data.avgSessionsDuration)}s
              </p>

              <p>-</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
